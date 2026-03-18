// ONE桌遊 AI 選址系統 - Google Apps Script 後端 v3.0
// 新增：建物年份查詢（實價登錄）

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
    } else if (action === 'zoning') {
      result = getZoningInfo(e.parameter.lat, e.parameter.lng, e.parameter.city);
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

// 查詢建物資訊（實價登錄 + Google Places）
function getBuildingInfo(address) {
  try {
    // 方法 1：透過 Google Places Details 取得建物資訊
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&language=zh-TW`;
    const geocodeResponse = UrlFetchApp.fetch(geocodeUrl);
    const geocodeData = JSON.parse(geocodeResponse.getContentText());
    
    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      return {
        status: 'NOT_FOUND',
        building_year: null,
        building_age: null,
        note: '查無建物資料'
      };
    }
    
    const placeId = geocodeData.results[0].place_id;
    
    // 使用 Place Details 查詢更多資訊
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_date,types&key=${API_KEY}&language=zh-TW`;
    
    try {
      const detailsResponse = UrlFetchApp.fetch(detailsUrl);
      const detailsData = JSON.parse(detailsResponse.getContentText());
      
      // Google Places 可能有開業日期（但不一定是建物年份）
      if (detailsData.status === 'OK' && detailsData.result) {
        // 這裡只能獲取有限資訊
        // 實價登錄整合需要下載完整資料集
      }
    } catch (e) {
      Logger.log('Place Details error: ' + e);
    }
    
    // 方法 2：實價登錄查詢（簡化版）
    // 注意：完整實價登錄需要預先下載資料到 Google Sheets
    
    // 目前返回預估值
    return {
      status: 'ESTIMATED',
      building_year: null,
      building_age: null,
      note: '建物年份資料待整合（需匯入實價登錄資料）',
      source: 'estimation'
    };
    
  } catch (error) {
    return {
      status: 'ERROR',
      building_year: null,
      building_age: null,
      error: error.toString()
    };
  }
}

// 搜尋競爭店家（麻將館、桌遊店）
function searchCompetitors(lat, lng) {
  const radius = 500;
  const keywords = ['麻將', '桌遊', 'ONE桌遊'];
  let allCompetitors = [];
  
  try {
    keywords.forEach(keyword => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${API_KEY}&language=zh-TW`;
      
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.status === 'OK' && data.results) {
        allCompetitors = allCompetitors.concat(data.results);
      }
    });
    
    // 去重
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

// 查詢使用分區（混合方案）
function getZoningInfo(lat, lng, city) {
  try {
    // 方法 1：嘗試查詢政府 WMS（台中市）
    if (city === '台中市') {
      // 台中市 WMS 查詢
      // 注意：這需要複雜的 GIS 處理，這裡先返回基礎資訊
      
      return {
        status: 'MANUAL_CHECK',
        zoning: null,
        confidence: 0,
        message: '請至台中市都發局網站確認使用分區',
        url: 'https://www.ud.taichung.gov.tw/',
        note: '⚠️ 台中市麻將館限定商業區'
      };
    }
    
    // 其他縣市
    const zoningUrls = {
      '新北市': 'https://udpweb.planning.ntpc.gov.tw/',
      '桃園市': 'https://gis.tycg.gov.tw/TycgOGCMap_Web/',
      '台北市': 'https://www.zone.gov.taipei/',
      '台南市': 'https://www.tainan.gov.tw/',
      '高雄市': 'https://urban-web.kcg.gov.tw/KDA_gis/'
    };
    
    return {
      status: 'MANUAL_CHECK',
      zoning: null,
      confidence: 0,
      message: `請至${city}都發局網站確認使用分區`,
      url: zoningUrls[city] || '',
      note: city === '台中市' ? '⚠️ 台中市麻將館限定商業區' : '住宅區或商業區皆可'
    };
    
  } catch (error) {
    return {
      status: 'ERROR',
      zoning: null,
      error: error.toString()
    };
  }
}

// 測試函式
function testGeocode() {
  const result = geocodeAddress('台中市西屯區台灣大道三段99號');
  Logger.log(JSON.stringify(result, null, 2));
}

function testBuildingInfo() {
  const result = getBuildingInfo('台中市西屯區文華路138巷6號2樓');
  Logger.log(JSON.stringify(result, null, 2));
}

function testCompetitors() {
  const result = searchCompetitors(24.1631, 120.6413);
  Logger.log(JSON.stringify(result, null, 2));
}

function testZoning() {
  const result = getZoningInfo(24.1631, 120.6413, '台中市');
  Logger.log(JSON.stringify(result, null, 2));
}
