# MILON — Our Memories | Class of 2026

বাংলাদেশের নবম শ্রেণি ভোকেশনাল কম্পিউটার বিভাগের ২০২৬ ব্যাচের স্মৃতির ওয়েবসাইট। এটি একটি static website; ছবি সরাসরি HTTPS URL থেকে দেখানো হয়। Firebase Storage ব্যবহার করা হয়নি।

## ফাইলগুলো
- `index.html` — সবার জন্য মূল ওয়েবসাইট
- `style.css` — রেসপনসিভ Premium Blue-Purple ডিজাইন
- `app.js` — পাবলিক ওয়েবসাইটের Firebase Realtime Database সংযোগ
- `admin.html_1010.html` — আলাদা অ্যাডমিন প্যানেল (নিজস্ব CSS/JS inline)
- `database.rules.json` — প্রস্তাবিত Realtime Database security rules
- `favicon.svg` — সাধারণ MILON favicon placeholder

## ১. Firebase তৈরি ও কনফিগার
1. Firebase Console-এ একটি project তৈরি করুন।
2. Project settings → General → Your apps → Web app তৈরি করুন।
3. দেখানো Firebase Web App config কপি করুন।
4. `app.js` এবং `admin.html_1010.html`-এর `firebaseConfig`-এ একই সঠিক `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId` বসান। `YOUR_...` placeholder যেন না থাকে।
5. Firebase Console → Build → Realtime Database → Create Database করুন। `databaseURL` অবশ্যই Console-এ দেখানো আসল URL থেকে কপি করবেন; উদাহরণে দেওয়া region আপনার প্রজেক্টের সঙ্গে নাও মিলতে পারে।
6. Authentication → Sign-in method → Email/Password enable করুন।
7. Authentication → Users → Add user থেকে নিজে অ্যাডমিন ইমেইল ও শক্তিশালী পাসওয়ার্ড তৈরি করুন। এই পাসওয়ার্ড কখনো HTML/JavaScript ফাইলে লিখবেন না এবং কাউকে শেয়ার করবেন না। Public sign-up form তৈরি করা হয়নি।
8. Authentication → Users-এ তৈরি অ্যাডমিনের UID কপি করুন।
9. `database.rules.json`-এর প্রতিটি `REPLACE_WITH_ADMIN_UID` জায়গায় সেই UID বসান, তারপর Realtime Database → Rules-এ rules publish করুন।

## ২. Security rules সম্পর্কে
- অনুমোদিত public content সবার জন্য read-only রাখা হয়েছে।
- Create/update/delete কেবল নির্দিষ্ট Firebase Auth UID-তে সীমাবদ্ধ।
- `REPLACE_WITH_ADMIN_UID` বদলানো ছাড়া rules publish করবেন না; না হলে admin write কাজ করবে না।
- Firebase Console-এ Test mode বা unrestricted write rules ব্যবহার করবেন না।
- যেহেতু public read চালু, এখানে কেবল প্রকাশের অনুমতি পাওয়া ছবি ও তথ্য রাখুন। ব্যক্তিগত ফোন নম্বর, ঠিকানা, ব্যক্তিগত নোট বা অনুমতি ছাড়া ছাত্রছাত্রীর ছবি দেবেন না।

## ৩. Netlify-তে প্রকাশ
1. এই ফোল্ডারের ফাইলগুলো GitHub repository-তে আপলোড করুন, অথবা Netlify-তে এই ফোল্ডারটি deploy করুন।
2. Netlify-তে GitHub repository connect করে Deploy করুন; build command ফাঁকা এবং publish directory repository root রাখুন।
3. Deploy শেষ হলে Netlify URL খুলে homepage পরীক্ষা করুন।
4. Admin page: `https://YOUR-SITE.netlify.app/admin.html_1010.html`
5. Firebase Authentication → Settings → Authorized domains-এ আপনার Netlify domain যুক্ত আছে কি না দেখুন।
6. Firebase config সঠিক এবং rules-এ UID ঠিক থাকলে admin login ও CRUD কাজ করবে।

## ৪. পরে ছবি যোগ করার নিয়ম
1. ছবিটি এমন কোনো image hosting-এ রাখুন যা সরাসরি HTTPS image URL দেয়।
2. URL browser-এ খুলে ছবিটি সরাসরি দেখা যায় কি না যাচাই করুন। শুধু webpage/share URL সবসময় image URL নয়।
3. Admin page-এ login করে `স্মৃতির গ্যালারি` বেছে শিরোনাম, ক্যাটাগরি, তারিখ, বর্ণনা ও HTTPS image URL দিন।
4. `সংরক্ষণ করুন` চাপুন। Public website-এ gallery update live দেখানোর জন্য Realtime Database listener যুক্ত আছে।
5. শিক্ষক যোগ করতে `শিক্ষক পরিচিতি`, timeline event যোগ করতে `পথচলার ঘটনা` বেছে নিন। ছবি ও ব্যক্তিগত তথ্য প্রকাশের আগে অনুমতি নিন।

## ৫. গুরুত্বপূর্ণ নোট ও সীমাবদ্ধতা
- Firebase config browser-এ ব্যবহারের জন্য তৈরি public project config; এটি password নয়। নিরাপত্তা নিশ্চিত হয় Authentication ও Database Rules দিয়ে।
- Admin panel-এর জন্য কোনো hardcoded default login code/password নেই। Firebase Console-এ তৈরি account-ই ব্যবহার করুন।
- এই starter project-এ direct image URL আছে, file upload widget নেই; Firebase Storage চাওয়া হয়নি বলে ফাইল Firebase-এ আপলোড হয় না।
- `memories` ও `siteSettings` collection-এর record admin-এ রাখা যায়; homepage-এ gallery, teachers ও timeline দৃশ্যমানভাবে রেন্ডার করা হয়েছে।
- Deployment-এর আগে নিজের Firebase config/rules বসিয়ে বাস্তব browser-এ পরীক্ষা করুন। Firebase project credentials না থাকায় এখানে live Firebase connectivity যাচাই করা সম্ভব নয়।


## এই প্রজেক্টের Firebase কনফিগারেশন
এই সংস্করণে মালিকের দেওয়া Firebase Web App config `app.js` এবং `admin.html_1010.html`-এ বসানো আছে। Database Rules-এ নির্দিষ্ট Admin UID-ও বসানো আছে। Firebase Console-এ Rules Publish করা এবং Authentication-এ ওই UID-র অ্যাকাউন্ট নিশ্চিত করা এখনো তোমাকেই করতে হবে। Web API key ক্লায়েন্ট কনফিগারেশনের অংশ; নিরাপত্তা নিশ্চিত করতে Database Rules ও Authentication জরুরি।

## অ্যাডমিন লগইন
এই সাইটে কোনো ডিফল্ট পাসওয়ার্ড রাখা নেই। Firebase Console → Authentication → Users-এ যে অ্যাকাউন্টের UID `wdP2dg3L2Pff5oUIpBc6AyrqpZW2`, তার Email/Password দিয়ে লগইন করবে। অন্য UID-র অ্যাকাউন্ট অ্যাডমিন প্যানেল থেকে সাইন আউট হয়ে যাবে।
