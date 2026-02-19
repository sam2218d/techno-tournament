
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crgeyeycqzdaxromsohb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZ2V5ZXljcXpkYXhyb21zb2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzI3NzgsImV4cCI6MjA4NjkwODc3OH0.tebc7R67Y7k1mSELxWqQ2EinpH9cy7iPZTEgrVtiH0g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
    const email = 'sam@gmail.com';
    const password = 's12345';

    console.log(`Attempting to register ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created or already exists:', data);
        console.log('Please check your email for confirmation if required, or you may be able to login directly if email confirmation is disabled.');
    }
}

createAdmin();
