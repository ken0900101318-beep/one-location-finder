// ONE桌遊 AI 選址系統 - Google Apps Script 後端 v2.0
// 功能：解決CORS、查詢實價登錄、搜尋競爭店家

const API_KEY = 'AIzaSyA8BU6HhUvgnnmJpP5CgyrUDAnmBvg1GIY';

// CORS 設定
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    
    if (action === 'geocode') {
      result = geocodeAddress(e.parameter.address);
    } else if (action === 'nearby') {
      result = searchNearby(e.parameter.lat, e.parameter.lng, e.parameter.type, e.parameter.radius);
    } else if (action === 'building') {
      result = getBuildingInfo(e.parameter.address);
    } else if (action === 'competitors') {
      result = searchCompetitors(e.parameter.lat, e.parameter.lng);
    } else {
      result = { error: 'Unknown action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'ERROR', 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 地址轉座標
function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=zh-TW`;
  
  const response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText());
}

// 搜尋附近地點
function searchNearby(lat, lng, type, radius) {
  radius = radius || 200;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}&language=zh-TW`;
  
  const response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText());
}

// 查詢建物資訊（實價登錄）
function getBuildingInfo(address) {
  try {
    // 內政部實價登錄 API
    // 注意：這是簡化版，實際需要更複雜的查詢邏輯
    
    // 由於實價登錄 API 較複雜，這裡先返回預設值
    // 未來可整合完整 API
    
    return {
      status: 'OK',
      building_year: null, // 未來整合
      building_type: null,
      note: '建物年份需人工確認（實價登錄 API 待整合）'
    };
    
  } catch (error) {
    return {
      status: 'ERROR',
      error: error.toString()
    };
  }
}

// 搜尋競爭店家（麻將館、桌遊店）
function searchCompetitors(lat, lng) {
  const radius = 500; // 500m 範圍
  const keywords = ['麻將', '桌遊', 'ONE桌遊'];
  let allCompetitors = [];
  
  try {
    // 搜尋各關鍵字
    keywords.forEach(keyword => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${API_KEY}&language=zh-TW`;
      
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.status === 'OK' && data.results) {
        allCompetitors = allCompetitors.concat(data.results);
      }
    });
    
    // 去重（同一家店可能出現多次）
    const uniqueCompetitors = [];
    const seen = new Set();
    
    allCompetitors.forEach(place => {
      if (!seen.has(place.place_id)) {
        seen.add(place.place_id);
        uniqueCompetitors.push({
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 0,
          place_id: place.place_id
        });
      }
    });
    
    return {
      status: 'OK',
      results: uniqueCompetitors,
      count: uniqueCompetitors.length
    };
    
  } catch (error) {
    return {
      status: 'ERROR',
      results: [],
      count: 0,
      error: error.toString()
    };
  }
}

// 測試函式
function testGeocode() {
  const result = geocodeAddress('台中市西屯區台灣大道三段99號');
  Logger.log(JSON.stringify(result, null, 2));
}

function testNearby() {
  const result = searchNearby(24.1631, 120.6413, 'school', 200);
  Logger.log(JSON.stringify(result, null, 2));
}

function testCompetitors() {
  const result = searchCompetitors(24.1631, 120.6413);
  Logger.log(JSON.stringify(result, null, 2));
}

function testBuildingInfo() {
  const result = getBuildingInfo('台中市西屯區台灣大道三段99號');
  Logger.log(JSON.stringify(result, null, 2));
}
