import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const [userId, setUserId] = useState('');
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('manual');
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const MODELS = [
        { id: 'manual', name: 'Manual (Default)' },
        { id: 'flux', name: 'Flux' },
        { id: 'seedream4', name: 'Seedream 4' },
        { id: 'nanobanana', name: 'NanoBanana' },
        { id: 'nanobanana-pro', name: 'NanoBanana Pro' },
        { id: 'qwen-edit', name: 'Qwen Edit' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    if (isMain) {
                        setMainImage(reader.result);
                    } else {
                        setReferenceImages(prev => [...prev, reader.result as string]);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !prompt || !mainImage) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/generation/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    prompt,
                    model,
                    image: mainImage,
                    input_images: referenceImages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create generation');
            }

            toast.success('Generation created successfully!');
            // Reset form
            setPrompt('');
            setMainImage(null);
            setReferenceImages([]);
            setModel('manual');
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Manual Generation</h1>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <label className="block text-sm font-medium mb-2">User ID</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="Enter User ID"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {MODELS.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setModel(m.id)}
                                className={`p-2 rounded-lg text-sm font-medium transition-colors ${model === m.id
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                                    }`}
                            >
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="Enter prompt..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Main Image (Result)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="block w-full text-sm text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-600 file:text-white
              hover:file:bg-violet-700"
                    />
                    {mainImage && (
                        <div className="mt-4">
                            <img src={mainImage} alt="Main preview" className="w-full h-64 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => setMainImage(null)}
                                className="mt-2 text-red-500 text-sm hover:text-red-400"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Reference Images (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        className="block w-full text-sm text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-zinc-700 file:text-white
              hover:file:bg-zinc-600"
                    />
                    {referenceImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {referenceImages.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={img} alt={`Ref ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setReferenceImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${isLoading
                        ? 'bg-zinc-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500'
                        }`}
                >
                    {isLoading ? 'Processing...' : 'Create Generation'}
                </button>
            </form>
        </div>
    );
}
