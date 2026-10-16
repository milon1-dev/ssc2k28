MILON — Our Memories (Firebase Realtime Database)
==================================================

Files:
- index.html                 Public memory gallery
- admin.html_1010.html       Single-file Admin Panel (as requested)
- database.rules.json        Suggested Realtime Database security rules

No Firebase Storage is used. Image files are loaded from direct HTTPS image URLs.

IMPORTANT SETUP
1. In Firebase Console > Authentication > Sign-in method, enable Email/Password.
2. Create the one Admin user in Authentication > Users. Do not add a public sign-up form.
3. In database.rules.json, replace REPLACE_WITH_YOUR_ADMIN_EMAIL with the exact email of your Admin user.
4. Firebase Console > Realtime Database > Rules: replace current rules with the edited rules file and Publish.
   Public read is enabled so visitors can see memories; writes are restricted to the exact Admin email.
5. Upload index.html and admin.html_1010.html to the same Netlify site/root folder.
6. Open /admin.html_1010.html to sign in and add memories.
7. Use a direct HTTPS image URL (for example a hosted .jpg/.png/webp URL). This site does not upload images.

NOTES
- Firebase Web API key in client config is not a password; security comes from Authentication and database rules.
- Do not use test mode or public write rules.
- The site uses Firebase modular Web SDK v11.10.0 from Google's CDN.
- The current Firebase Realtime Database was created in locked mode, so reads/writes will fail until rules are published.
- Realtime Database free-tier quotas/limits apply. Netlify free-plan limits also apply.
- This starter uses Firebase Email/Password login, not a hard-coded PIN. Keep the Admin password private.
- This is a generated starter package, not yet deployed to your Firebase or Netlify account.
