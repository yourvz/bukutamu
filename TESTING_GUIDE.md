# 📋 Testing Guide - Buku Tamu Application

## 🎯 Quick Start Testing

### For Desktop Users
1. Open: https://yourvz.github.io/bukutamu/
2. Fill the form with test data
3. Click "Kirim" button
4. Expect: Success message "✓ Kunjungan berhasil didaftarkan!"

### For Mobile Users
1. Open on your phone browser: https://yourvz.github.io/bukutamu/
2. Form should be full-width and touch-friendly
3. Fill form using mobile keyboard
4. Submit and verify success
5. Close and re-open - should load successfully

---

## ✅ Automated Tests

### Run Supabase Verification
```bash
node verify-supabase.js
```

**Expected Output**:
```
✅ All Supabase environment variables are set
✅ Asset paths use correct base URL
✅ Supabase client initialized
✅ Application is ready for deployment!
```

---

## 🧪 Manual Testing Scenarios

### Test 1: Basic Form Submission
**Device**: Desktop Browser
**Steps**:
1. Navigate to https://yourvz.github.io/bukutamu/
2. Fill Name: "Test User 001"
3. Fill Phone: "082123456789"
4. Select From: "Umum"
5. Fill Purpose: "Testing aplikasi"
6. Click "Kirim"

**Expected Result**:
- Form submits without error
- Success message appears
- Form clears
- Data appears in Supabase within 2 seconds

---

### Test 2: Mobile Responsiveness (Portrait)
**Device**: Mobile Phone (Portrait)
**Steps**:
1. Open https://yourvz.github.io/bukutamu/
2. Observe layout
3. Scroll to see all elements
4. Fill form with touch keyboard
5. Submit

**Expected Result**:
- Hero section displays properly
- Form is full-width and readable
- Input fields are >44x44px (easy to tap)
- Keyboard doesn't prevent form visibility
- Submit succeeds

---

### Test 3: Mobile Responsiveness (Landscape)
**Device**: Mobile Phone (Landscape)
**Steps**:
1. Open https://yourvz.github.io/bukutamu/
2. Rotate phone to landscape
3. Verify layout adjusts
4. Fill form
5. Submit

**Expected Result**:
- Layout adapts to landscape
- All elements still visible
- Form functional

---

### Test 4: Conditional Field (Instansi)
**Device**: Any
**Steps**:
1. Open form
2. Select "Instansi" from dropdown
3. New field "NAMA INSTANSI" should appear
4. Fill all fields including institution name
5. Submit

**Expected Result**:
- Conditional field appears when "Instansi" selected
- Data includes institution name in Supabase
- Submit succeeds

---

### Test 5: Conditional Field (Organisasi)
**Device**: Any
**Steps**:
1. Open form
2. Select "Organisasi" from dropdown
3. New field "NAMA ORGANISASI" should appear
4. Fill all fields including organization name
5. Submit

**Expected Result**:
- Conditional field appears when "Organisasi" selected
- Data includes organization name in Supabase
- Submit succeeds

---

### Test 6: Validation - Empty Name
**Device**: Any
**Steps**:
1. Open form
2. Skip name field
3. Fill other fields
4. Click "Kirim"

**Expected Result**:
- Error message: "Silakan isi nama lengkap"
- Form doesn't submit
- Focus moves to name field

---

### Test 7: Validation - Invalid Phone
**Device**: Any
**Steps**:
1. Open form
2. Fill Name: "Test"
3. Fill Phone: "abc"
4. Click "Kirim"

**Expected Result**:
- Error message: "Format nomor telepon tidak valid"
- Form doesn't submit

---

### Test 8: Validation - Missing Organization
**Device**: Any
**Steps**:
1. Open form
2. Select "Instansi"
3. Skip "NAMA INSTANSI" field
4. Fill other fields
5. Click "Kirim"

**Expected Result**:
- Error message: "Silakan isi nama Instansi"
- Form doesn't submit

---

### Test 9: Validation - Missing Purpose
**Device**: Any
**Steps**:
1. Open form
2. Fill Name, Phone, From
3. Skip Purpose field
4. Click "Kirim"

**Expected Result**:
- Error message: "Silakan isi keperluan kunjungan"
- Form doesn't submit

---

### Test 10: Slow Network Simulation
**Device**: Desktop (Chrome DevTools)
**Steps**:
1. Open DevTools (F12)
2. Go to Network tab
3. Set throttle to "Slow 3G"
4. Reload page
5. Fill form and submit

**Expected Result**:
- Page loads (may take longer)
- Form remains functional
- Submit works but takes longer
- Loading state shows while submitting

---

## 📊 Supabase Data Verification

After each test, verify data in Supabase:

1. Go to: https://app.supabase.com/
2. Select your project
3. Navigate to: Database → Tables → `tamu`
4. Check latest row contains:
   - `nama`: Your test name
   - `telepon`: Your test phone
   - `dari`: Selected type (umum/instansi/organisasi)
   - `nama_instansi`: Institution name (if applicable)
   - `keperluan`: Your test purpose
   - `ip_address`: Your IP
   - `user_agent`: Your browser info
   - `waktu_kunjungan`: Current timestamp

---

## 🔍 Browser Console Check

After each test, open browser DevTools (F12) and check:

1. **Console Tab**
   - No red error messages
   - No warnings about missing assets
   - Success logs: "✓ Data submitted successfully"

2. **Network Tab**
   - All assets load (200 status)
   - Form submission shows 200 or 201 status
   - No failed requests

3. **Sources Tab**
   - JavaScript code is readable
   - No source map errors

---

## 📱 Device Testing Matrix

| Device | Browser | Tested | Date | Notes |
|--------|---------|--------|------|-------|
| Desktop | Chrome | - | - | |
| Desktop | Firefox | - | - | |
| Desktop | Safari | - | - | |
| Desktop | Edge | - | - | |
| iPhone | Safari | - | - | iOS 14+ |
| Android | Chrome | - | - | |
| Android | Firefox | - | - | |
| iPad | Safari | - | - | Landscape |
| Pixel | Chrome | - | - | Android |

*Mark with ✅ or ❌ after testing*

---

## 🐛 Issue Reporting Template

If you find a bug, report it like this:

```
Title: [Brief Issue Description]

Device: [Device Type]
Browser: [Browser Name & Version]
OS: [Operating System]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots/Logs:
[Include console errors if any]
```

---

## ✨ Performance Testing

### Load Time Test
```javascript
// Open DevTools Console and paste:
console.time('Page Load');
window.addEventListener('load', () => {
  console.timeEnd('Page Load');
});
```
**Target**: < 3 seconds

### Form Submit Time Test
```javascript
// Open DevTools Console and paste:
console.time('Submit');
// Fill form and click submit
// Check console time
```
**Target**: < 2 seconds

---

## 🎓 Sample Test Data

Use this data for testing (modify as needed):

### Test User 1 (Basic)
- Name: Testing Pengunjung 001
- Phone: 082123456789
- From: Umum
- Purpose: Mengecek aplikasi buku tamu

### Test User 2 (Institution)
- Name: Bapak Manager A
- Phone: 081234567890
- From: Instansi
- Institution: PT Maju Jaya Indonesia
- Purpose: Meeting rutin dengan kepala dinas

### Test User 3 (Organization)
- Name: Ibu Koordinator B
- Phone: 085432109876
- From: Organisasi
- Organization: Yayasan Peduli Lingkungan
- Purpose: Sosialisasi program CSR

---

## 📝 Test Report Template

```
# Test Report - [Date]

## Environment
- Device: [Device]
- Browser: [Browser]
- URL: https://yourvz.github.io/bukutamu/
- Network: [WiFi/Mobile]

## Tests Run
- [ ] Test 1: Form Submission
- [ ] Test 2: Mobile Portrait
- [ ] Test 3: Mobile Landscape
- [ ] Test 4: Validation
- [ ] Test 5: Data in Supabase

## Results
- Total Tests: 5
- Passed: X
- Failed: Y
- Blocked: Z

## Issues Found
- [List any issues]

## Conclusion
[Pass/Fail with notes]

Date: [Date]
Tester: [Name]
```

---

## 🚀 Pre-Launch Checklist

Before launching publicly:
- [ ] Run `node verify-supabase.js` - All checks pass
- [ ] Test on desktop browser - Works
- [ ] Test on iPhone - Works
- [ ] Test on Android - Works
- [ ] Test on tablet - Works
- [ ] Check Supabase has test data
- [ ] No console errors
- [ ] All assets load (no 404s)
- [ ] Form validation works
- [ ] Success message appears
- [ ] Data persists in Supabase

---

## 🆘 Common Issues & Solutions

### Issue: "Form won't submit"
**Solution**:
1. Check browser console (F12 → Console)
2. Verify internet connection
3. Check `.env` variables
4. Try different browser
5. Hard refresh (Ctrl+Shift+Delete cache + Ctrl+F5)

### Issue: "Data doesn't appear in Supabase"
**Solution**:
1. Wait 5-10 seconds, refresh Supabase dashboard
2. Check you're viewing correct table
3. Check Supabase project is active
4. Verify RLS policies allow public insert

### Issue: "Mobile form is too small"
**Solution**:
- Not an issue - form should scale to device
- Check device is set to responsive mode in browser
- Clear browser cache

### Issue: "Button clicks don't work"
**Solution**:
1. Check browser compatibility
2. Enable JavaScript
3. Try different browser
4. Check browser extensions aren't blocking

---

**Last Updated**: 2026-06-11
**Status**: 🟢 Ready for Testing
