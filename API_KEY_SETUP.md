# 🔑 Google Maps API Key 設定指南

## 📝 明天要做的事

### 1. 取得 Google Maps API Key

**前往**：https://console.cloud.google.com/

**步驟**：
1. 登入 Google 帳號
2. 建立新專案（或選擇現有專案）
3. 點擊「啟用 API 和服務」
4. 搜尋並啟用以下 API：
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
5. 前往「憑證」→「建立憑證」→「API 金鑰」
6. 複製 API Key

---

### 2. 設定 API Key

**編輯檔案**：`index.html`

**第 316 行**：
```javascript
const API_KEY = 'YOUR_API_KEY_HERE'; 
// ↑ 替換為您的 API Key
```

**第 554 行**：
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&language=zh-TW"></script>
<!--                                                     ↑ 替換為您的 API Key -->
```

---

### 3. 推送更新

```bash
cd ~/.openclaw/workspace/one-location-finder
git add index.html
git commit -m "Add Google Maps API Key"
git push
```

**等待 1-2 分鐘**，系統即可使用！

---

## 🌐 網址

- **GitHub**：https://github.com/ken0900101318-beep/one-location-finder
- **網站**：https://ken0900101318-beep.github.io/one-location-finder/

---

## ⚠️ API 用量限制

### 免費額度（每月）
- **Maps JavaScript API**：無限制
- **Places API**：免費 $200 美元額度
  - 約 28,000 次 Nearby Search
  - 約 40,000 次 Geocoding
- **Geocoding API**：免費 $200 美元額度

**預估**：
- 單次查詢消耗約 $0.032 美元
- 免費額度可查詢約 **6,000 次**
- 對內部使用完全足夠

### 成本控管
建議在 Google Cloud Console 設定：
- **每日配額限制**：100 次
- **帳單警示**：$50 美元

---

## 🧪 測試方式

### 測試地址範例
```
✅ 合格地點：
- 台中市西屯區台灣大道三段99號（遠百）
- 新北市板橋區縣民大道二段7號

❌ 不合格地點（200m內有學校）：
- 台北市中正區重慶南路一段122號（鄰近建國中學）
```

---

## 📞 如遇問題

1. **地圖無法顯示** → 檢查 API Key 是否正確
2. **分析失敗** → 確認已啟用 Places API
3. **查詢超過限制** → 檢查 Cloud Console 用量

---

**準備好了就開始設定吧！** 🚀
