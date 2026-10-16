MILON — OUR MEMORIES
নবম শ্রেণি | ভোকেশনাল | কম্পিউটার বিভাগ | ব্যাচ ২০২৬
স্কুল: পঞ্চগড় সরকারি টেকনিক্যাল স্কুল ও কলেজ

========================
১. কী কী আছে
========================
- মোবাইল-ফ্রেন্ডলি Premium Blue-Purple ডিজাইন
- Welcome popup (একই ব্রাউজার সেশনে একবার)
- স্ক্রল রিভিল অ্যানিমেশন ও ভাসমান হিরো কার্ড
- স্মৃতির টাইমলাইন
- ক্যাটাগরি ফিল্টারসহ ছবি গ্যালারি ও lightbox
- শিক্ষক পরিচিতির কার্ড
- স্মৃতির বার্তা এবং MILON developer credit
- কোনো build step নেই; HTML/CSS/JS দিয়েই চলে

========================
২. Netlify-তে প্রকাশ করার নিয়ম
========================
সহজ উপায়:
1. ZIP ফাইলটি Extract/Unzip করো।
2. milon_class_memories ফোল্ডারের ভেতরের ফাইলগুলো GitHub repository-তে আপলোড করো।
3. Netlify-তে গিয়ে Add new site / Import an existing project নির্বাচন করো।
4. GitHub repository connect করো।
5. Build command ফাঁকা রাখো।
6. Publish directory হিসেবে . (root) ব্যবহার করো।
7. Deploy চাপো।

Netlify manual deploy করলে ZIP extract করে ফোল্ডারের ভেতরের index.html, style.css, script.js এবং assets ফোল্ডার একসঙ্গে deploy করো। ZIP-কে সরাসরি ওয়েবসাইট হিসেবে ব্যবহার করা যাবে না।

========================
৩. নিজের ছবি কীভাবে যোগ করবে
========================
1. assets/images/ ফোল্ডারে ছবি রাখো। উদাহরণ:
   class-group.jpg
   last-class.jpg
   friends-01.jpg
   computer-lab.jpg
   teachers.jpg

2. index.html ফাইল খুলে gallery-grid খুঁজে বের করো।
3. যে placeholder gallery-card-টি বদলাতে চাও সেটির ভেতরের
   <span class="placeholder-photo ..."> ... </span>
   অংশের জায়গায় এই ধরনের image tag বসাও:

   <img src="assets/images/class-group.jpg"
        alt="আমাদের ব্যাচের গ্রুপ ছবি"
        class="local-gallery-image">

4. style.css-এর শেষে এটি যোগ করো:

   .local-gallery-image {
     width: 100%;
     height: 100%;
     object-fit: cover;
     display: block;
   }

5. সেই gallery-card বাটনের data-placeholder="true" অংশ মুছে দাও।
6. data-title এবং data-description-এ ছবির সঠিক নাম/স্মৃতির বিবরণ বসাও।

ছবির নামের মধ্যে স্পেস বা বাংলা অক্ষর না রাখলে ফাইলের path সামলানো সহজ হয়। ছবির ফাইলের নাম ও HTML-এর নাম একদম একই হতে হবে।

========================
৪. শিক্ষক ও ব্যাচের তথ্য
========================
- index.html-এ "শিক্ষকের নাম যোগ করুন" খুঁজে সঠিক নাম বসাও।
- "বিষয় / পদবি" জায়গায় সঠিক বিষয় বা পদবি বসাও।
- শিক্ষকদের ছবি যোগ করতে চাইলে teacher-card-এর teacher-avatar অংশে img যোগ করে CSS-এ ছবির সাইজ সেট করো।
- তারিখ/ঘটনা নিশ্চিত না হলে অনুমান করে লিখবে না।
- অনুমতি ছাড়া কারও ব্যক্তিগত ছবি, ফোন নম্বর বা ব্যক্তিগত তথ্য প্রকাশ করবে না।

========================
৫. গুরুত্বপূর্ণ
========================
- এটি static website; কোনো login, online upload বা database এখনো নেই।
- গ্যালারির ছবি HTML-এ যোগ করতে হবে। পরে চাইলে Firebase/Cloudinary দিয়ে online upload ব্যবস্থা যোগ করা যাবে।
- ছবি যোগ করার পর মোবাইলে খুলে সব লিংক, ছবি এবং বানান পরীক্ষা করে নাও।
- স্কুলের নাম ও শিক্ষকদের পরিচয় প্রকাশের আগে সঠিকতা নিশ্চিত করো।

DESIGNED & DEVELOPED BY MILON
App & Web Developer
