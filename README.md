# ONE桌遊 AI 選址系統

快速評估麻將館開店地點是否符合法規的智慧工具。

## 🎯 功能特色

### 自動分析
- ✅ **200m 學校檢查**：自動搜尋國小、國中、高中
- 📊 **人流量評估**：根據周邊餐廳/商店密度估算
- 🚇 **交通便利度**：計算公車站/捷運站數量
- 🏢 **綜合評分**：0-100 分評分系統

### 評分標準
| 項目 | 滿分 | 說明 |
|------|------|------|
| 200m內無學校 | 40分 | 法規強制要求 |
| 人流量高 | 20分 | 周邊餐廳/商店數量 |
| 交通便利 | 15分 | 公車/捷運站點 |
| 建物年份新 | 10分 | 需人工確認 |
| 無競爭店家 | 15分 | 需人工確認 |

### 使用分區提示
- **台中市**：僅限商業區
- **新北/台北/桃園**：住宅區或商業區皆可

---

## 📦 安裝步驟

### 1. 取得 Google Maps API Key

前往 [Google Cloud Console](https://console.cloud.google.com/)

1. 建立新專案（或選擇現有專案）
2. 啟用 API：
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. 建立憑證 → API 金鑰
4. 複製 API Key

### 2. 設定 API Key

編輯 `index.html`：

**第 316 行**：
```javascript
const API_KEY = 'YOUR_API_KEY_HERE'; // 替換為您的 API Key
```

**第 554 行**：
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&language=zh-TW"></script>
```

將兩處 `YOUR_API_KEY_HERE` 替換為您的 API Key。

### 3. 部署到 GitHub Pages

```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/one-location-finder.git
git push -u origin main

# 啟用 GitHub Pages
# Settings → Pages → Source: main branch
```

網址：`https://YOUR_USERNAME.github.io/one-location-finder/`

---

## 🚀 使用方式

### 線上使用
1. 打開網站
2. 輸入地址（例：台中市西屯區台灣大道三段99號）
3. 選擇縣市
4. 點擊「開始分析」
5. 查看評分結果與建議

### 本地測試
```bash
# 使用 Python 簡易伺服器
cd one-location-finder
python3 -m http.server 8000

# 打開瀏覽器
open http://localhost:8000
```

---

## 📊 評分解讀

### 80-100 分：✅ 優秀
- 各項條件良好
- 建議進一步實地考察
- 可進行租金談判

### 60-79 分：⚠️ 良好
- 部分條件需補強
- 評估使用分區與租金
- 考慮競爭狀況

### 0-59 分：❌ 不推薦
- 關鍵條件不符
- 建議尋找其他地點

---

## ⚠️ 注意事項

### 自動化項目（已實作）
- ✅ 200m 內學校檢查
- ✅ 周邊人流量評估
- ✅ 交通便利度計算

### 需人工確認項目
- ⚠️ 使用分區（建議至各縣市都發局查詢）
- ⚠️ 建物年份（實價登錄網站查詢）
- ⚠️ 使用執照類別（D1）
- ⚠️ 競爭店家（實地考察）
- ⚠️ 租金合理性（市場行情比較）

---

## 🔧 技術規格

- **前端**：純 HTML + JavaScript（無框架）
- **地圖**：Google Maps JavaScript API
- **部署**：GitHub Pages（靜態託管）
- **響應式**：支援手機、平板、電腦

---

## 📝 開發紀錄

- **2026-03-18**：第一版完成
  - 核心評分系統
  - 學校距離檢查
  - 人流量與交通評估
  - 響應式介面

---

## 🔮 未來改進

1. **整合實價登錄 API** - 自動查詢建物年份
2. **使用分區 API** - 串接政府開放資料
3. **競爭分析** - 爬取桌遊店資訊
4. **批次分析** - 一次分析多個地點
5. **歷史記錄** - 儲存查詢結果
6. **匯出報告** - PDF 格式輸出

---

## 📞 聯絡資訊

- **開發者**：ONE桌遊團隊
- **用途**：內部選址工具
- **版本**：v1.0

---

**⚠️ 重要提醒**：本系統提供的評分僅供參考，實際開店前請務必：
1. 實地考察
2. 查詢使用分區
3. 確認使用執照類別
4. 評估租金與投資回報
5. 諮詢專業顧問
