# Google Apps Script 後端設定

## 🎯 目的
解決 CORS 問題，讓系統能正確查詢：
- ✅ 附近餐廳數量（人流評估）
- ✅ 附近交通站點（交通便利度）
- ✅ 使用分區查詢連結

---

## 📋 設定步驟

### 1️⃣ 建立 Google Apps Script

1. 前往：https://script.google.com/
2. 點擊「新專案」
3. 刪除預設代碼
4. 複製 `Code.gs` 的內容貼上
5. 點擊「儲存」，命名：`ONE桌遊選址API`

---

### 2️⃣ 部署為網頁應用程式

1. 點擊右上角「**部署**」→「**新增部署作業**」
2. 選擇類型：「**網頁應用程式**」
3. 說明：`ONE桌遊選址系統API v1.0`
4. 執行身分：「**我**」
5. 具有存取權的使用者：「**所有人**」
6. 點擊「**部署**」
7. **複製網頁應用程式網址**

網址格式：
```
https://script.google.com/macros/s/AKfycby.../exec
```

---

### 3️⃣ 更新前端

編輯 `index.html`：

**搜尋**：`const GAS_URL = '';`

**替換為**：
```javascript
const GAS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

---

### 4️⃣ 推送更新

```bash
cd ~/.openclaw/workspace/one-location-finder
git add .
git commit -m "Add GAS backend URL"
git push
```

---

## 🧪 測試

### 測試 GAS 後端

在 Google Apps Script 中：
1. 點擊上方「執行」→ 選擇 `testGeocode`
2. 查看執行記錄（Ctrl+Enter）
3. 應該看到 JSON 回應

### 測試完整系統

1. 前往：https://ken0900101318-beep.github.io/one-location-finder/
2. 輸入地址測試
3. 應該顯示：
   - ✅ 學校檢查
   - ✅ 餐廳數量
   - ✅ 交通站點
   - ✅ 使用分區查詢連結

---

## 📊 功能清單

設定完成後，系統會顯示：

### 自動分析
- ✅ 200m 內學校檢查
- ✅ 人流量評估（餐廳數量）
- ✅ 交通便利度（站點數量）
- ✅ 地圖視覺化（含 200m 圓圈）

### 使用分區
- ✅ 顯示該縣市政府查詢網站
- ✅ 提供查詢指引
- ✅ 台中市特別提示（限商業區）

### 綜合評分
- 0-100 分評分系統
- 詳細評分明細
- 建議與提醒

---

## ⚠️ 注意事項

### API 用量
- Google Apps Script 每日配額：20,000 次
- 每次查詢消耗：3 次 API 調用
- 足夠內部使用

### 安全性
- API Key 已內建在 GAS 中（安全）
- 前端不會暴露 API Key

---

**Ken，你需要執行步驟 1-3，然後告訴我 GAS URL！**
