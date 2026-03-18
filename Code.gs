// ONE桌遊 AI 選址系統 - Google Apps Script 後端
// 部署為網頁應用程式，提供 API 服務

const API_KEY = 'AIzaSyA8BU6HhUvgnnmJpP5CgyrUDAnmBvg1GIY';

// CORS 設定
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'geocode') {
    return geocodeAddress(e.parameter.address);
  } else if (action === 'nearby') {
    return searchNearby(e.parameter.lat, e.parameter.lng, e.parameter.type, e.parameter.radius);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 地址轉座標
function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=zh-TW`;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'ERROR', 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 搜尋附近地點
function searchNearby(lat, lng, type, radius) {
  radius = radius || 200;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}&language=zh-TW`;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'ERROR', 
      results: [],
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 測試函式
function testGeocode() {
  const result = geocodeAddress('台中市西屯區台灣大道三段99號');
  Logger.log(result.getContent());
}

function testNearby() {
  const result = searchNearby(24.1631, 120.6413, 'school', 200);
  Logger.log(result.getContent());
}
