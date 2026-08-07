// File: web_dashboard/src/utils/i18n.js
export const dashboardTranslations = {
    en: {
        title: "Jharkhand NOC Command Center",
        overview: "Command Overview",
        complaints: "Live Complaints Queue",
        map: "Geospatial Telemetry",
        settings: "Audit Logs & Security",
        total_issues: "Total Reported Issues",
        emergency_dispatch: "Emergency Dispatch",
        repair_budget: "Estimated Repair Budget",
        resolve: "Resolve (+10 Pts)",
        reject: "Reject (-25 Pts)",
        in_progress: "In Progress",
        sync_db: "🔄 Sync DB",
        assigned_dept: "Assigned Department",
    },
    hi: {
        title: "झारखंड कमांड और नियंत्रण केंद्र",
        overview: "कमांड अवलोकन",
        complaints: "शिकायत कतार",
        map: "भू-स्थानिक मैपिंग",
        settings: "सुरक्षा एवं ऑडिट लॉग",
        total_issues: "कुल दर्ज शिकायतें",
        emergency_dispatch: "आपातकालीन प्रेषण",
        repair_budget: "अनुमानित मरम्मत बजट",
        resolve: "निस्तारण करें (+10 अंक)",
        reject: "अस्वीकार करें (-25 अंक)",
        in_progress: "प्रगति पर",
        sync_db: "🔄 डेटा सिंक्स करें",
        assigned_dept: "आवंटित विभाग",
    }
};

let currentLang = 'en';

export const setDashboardLanguage = (lang) => {
    currentLang = lang;
};

export const getDashboardLanguage = () => currentLang;

export const t = (key) => {
    return dashboardTranslations[currentLang]?.[key] || dashboardTranslations['en']?.[key] || key;
};
