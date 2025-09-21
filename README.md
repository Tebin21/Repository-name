# سیستەمی فرۆشتن - Kurdish Sales Management System

سیستەمێکی سادە بۆ بەڕێوەبردنی فرۆشتن بە زمانی کوردی

## تایبەتمەندییەکان

- 🔐 سیستەمی چوونە ژوورەوە (ناو: sarhang، پاسسۆرد: 1212)
- 📱 دیزاینی تایبەت بە مۆبایل و گونجاو لەگەڵ هەموو ئایفۆنێک
- 🛒 زیادکردنی کاڵای نوێ بۆ فرۆشتن
- 📋 بینینی لیستی کاڵا فرۆشراوەکان
- ✏️ دەستکاری و نوێکردنەوەی زانیارییەکان
- 📄 دەرهێنانی ڕاپۆرت بە شێوەی PDF
- 🗄️ پاشەکەوتکردنی داتاکان لە MongoDB Atlas
- 🎨 فۆنتی کوردی (rabar.TTF)

## پێداویستییەکان

- Node.js 18+ 
- MongoDB Atlas account
- Vercel account (بۆ deployment)

## دامەزراندن

### 1. کۆپیکردنی پڕۆژەکە
```bash
git clone <repository-url>
cd barannnn
```

### 2. دامەزراندنی dependencies
```bash
npm install
```

### 3. ڕێکخستنی MongoDB Atlas

1. چوونە [MongoDB Atlas](https://www.mongodb.com/atlas)
2. دروستکردنی cluster نوێ
3. دروستکردنی database user
4. وەرگرتنی connection string

### 4. ڕێکخستنی Environment Variables

فایلی `.env.local` دەستکاری بکە:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sales-system?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
```

### 5. زیادکردنی فۆنتی کوردی

فایلی `rabar.TTF` لە فۆڵدەری `public/fonts/` دابنێ

### 6. ڕانکردنی پڕۆژەکە

```bash
npm run dev
```

پڕۆژەکە لە `http://localhost:3000` دەست پێ دەکات

## Deployment لە Vercel

### 1. پەیوەندیکردن بە Vercel

1. چوونە [Vercel](https://vercel.com)
2. Import کردنی پڕۆژەکە لە GitHub
3. زیادکردنی Environment Variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`

### 2. Deploy کردن

Vercel بە شێوەی خۆکار پڕۆژەکە deploy دەکات

## بەکارهێنان

### چوونە ژوورەوە
- ناوی بەکارهێنەر: `sarhang`
- پاسسۆرد: `1212`

### زیادکردنی کاڵای نوێ
1. کلیک لە "فرۆشتن"
2. پڕکردنەوەی فۆرمەکە (هەموو خانەکان ئیختیاری بن)
3. کلیک لە "زیادکردن"

### بینینی کاڵا فرۆشراوەکان
1. کلیک لە "فرۆشراوە"
2. بینینی لیستەکە بە ڕیزبەندی بەرواری
3. دەستکاری یان سڕینەوەی کاڵاکان
4. دەرهێنانی PDF

## تایبەتمەندییە تەکنیکییەکان

- **Framework**: Next.js 14
- **Database**: MongoDB Atlas
- **Styling**: CSS-in-JS with mobile-first design
- **Font**: Kurdish Rabar font support
- **PDF Export**: HTML-based PDF generation
- **Authentication**: Simple localStorage-based auth
- **Responsive**: Optimized for iPhone screens

## پشتگیری

ئەگەر هەر پرسیارێکت هەیە یان کێشەیەکت هەیە، تکایە پەیوەندی بکە.

---

**تێبینی گرنگ**: پێش deployment، دڵنیابە لەوەی کە:
1. فایلی `rabar.TTF` لە شوێنی دروستدا دانراوە
2. MongoDB Atlas connection string دروستە
3. Environment variables بە دروستی ڕێکخراون