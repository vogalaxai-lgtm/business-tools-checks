# BusinessTools — Check Amount Writer

موقع ثابت (بدون إطار عمل) لكتابة مبالغ الشيكات الأمريكية بالحروف + مدقق للتطابق. يُبنى بـ Node ويُنشر على GitHub Pages.

## البنية
| المسار | المسؤولية |
|---|---|
| `src/js/words.js` | تحويل الأعداد إلى كلمات (BigInt) |
| `src/js/check.js` | قواعد الشيك الأمريكي، التحقق من المدخلات، الخيارات |
| `src/js/checker.js` | مدقق التطابق بين الأرقام والحروف |
| `src/js/ui.js` | ربط الواجهة (لا منطق أعمال هنا) |
| `src/templates/layout.mjs` | القالب المشترك والأدوات والتنقل |
| `content/pages.mjs` | محتوى كل الصفحات (صفحة = كائن) |
| `tests/` | اختبارات `node --test` |

## الأوامر
`npm test` · `npm run build` · `npm run dev`

## النشر
1. ارفع المشروع إلى GitHub، ثم Settings → Pages → Source: **GitHub Actions**.
2. كل push على `main` يشغّل الاختبارات ثم ينشر.
3. عند ربط نطاق خاص: في `deploy.yml` اجعل `BASE` فارغًا، وأضف متغير المستودع `SITE_URL`.

## إضافة صفحة / عملة / لغة
- **صفحة**: أضف كائنًا في `content/pages.mjs` (`{{examples:…}}` تولّد جدولًا من المحرك فلا يخطئ).
- **ميزة جديدة**: ملف منطق في `src/js/` + اختبار في `tests/` + أداة في `layout.mjs`.
- **المحرك القديم (8 عملات)**: ضعه في `src/js/legacy/` عند التوسع بعد بوابة الأشهر الستة.

## قبل النشر (TODO)
- [ ] اسم الموقع والنطاق، و`SITE_URL`
- [ ] صفحات About / Contact / Privacy: استبدل تعليقات `TODO`
- [ ] أضف Google Search Console وأرسل `sitemap.xml`
