// =====================================================================
// Google Apps Script untuk Database Ucapan & Doa (Google Spreadsheet)
// =====================================================================
// CARA PAKAI:
// 1. Buat Google Spreadsheet baru di https://sheets.new
// 2. Salin URL spreadsheet (https://docs.google.com/spreadsheets/d/...)
//    lalu tempel di SPREADSHEET_URL di bawah.
// 3. Buka menu: Extensions > Apps Script.
// 4. Hapus kode default, tempel seluruh isi file ini, lalu Save (Ctrl+S).
// 5. Klik Deploy > New deployment > type "Web app".
// 6. Execute as: "Me", Who has access: "Anyone" > Deploy (izinkan akses).
// 7. Salin URL Web App (berakhiran /exec) dan tempel di js/main.js
//    -> const API = { rsvp: null, comment: "URL_WEB_APP_ANDA" };
//
// PENTING: setiap kali mengubah kode script, klik Deploy > Manage
// deployments > Edit > Version: "New version" > Deploy (biar versi baru
// yang aktif). Atau gunakan URL /exec (bukan /dev).
// =====================================================================

// Isi URL spreadsheet di sini (wajib agar script tidak menunjuk yang salah):
const SPREADSHEET_URL = ""; // contoh: "https://docs.google.com/spreadsheets/d/XXXX/edit"

const SHEET_NAME = "Ucapan";

function getSheet() {
  const ss = SPREADSHEET_URL
    ? SpreadsheetApp.openByUrl(SPREADSHEET_URL)
    : SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "name", "message"]);
  }
  return sheet;
}

function doGet() {
  try {
    const values = getSheet().getDataRange().getValues();
    const rows = [];
    for (let i = 1; i < values.length; i++) {
      const v = values[i];
      if (!v[1] && !v[2]) continue; // lewati baris kosong
      rows.push({
        name: String(v[1] || ""),
        message: String(v[2] || ""),
        timestamp: v[0] ? String(v[0]) : "",
      });
    }
    rows.reverse(); // terbaru teratas
    return json_(rows);
  } catch (e) {
    return json_({ ok: false, error: e.message });
  }
}

function doPost(e) {
  try {
    const raw =
      (e && e.postData && e.postData.contents) || (e && typeof e === "object" ? JSON.stringify(e) : "{}");
    const data = JSON.parse(raw);
    const name = String(data.name || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !message) {
      return json_({ ok: false, error: "Nama atau ucapan kosong." });
    }

    getSheet().appendRow([new Date().toISOString(), name, message]);
    return json_({ ok: true });
  } catch (e) {
    return json_({ ok: false, error: e.message });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}