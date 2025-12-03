import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
    console.error('Please provide a password as an argument.');
    process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('\nSQL to update user:');
    console.log(`UPDATE public.users SET password_hash = '${hash}' WHERE user_id = YOUR_USER_ID;`);
});
