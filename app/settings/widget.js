// Initialize Zoho SDK
ZOHO.embeddedApp.on("PageLoad", function(data) {
    ZOHO.embeddedApp.init().then(function() {
        checkCurrentSetupState();
    });
});

function checkCurrentSetupState() {
    // Fetch the Fathom key Org variable to see if already configured
    ZOHO.CRM.CONFIG.getOrgInfo().then(function(info) {
        // You would invoke a custom function to fetch your Org variables safely
        ZOHO.CRM.FUNCTIONS.execute("getFathomSetupStatus", {}).then(function(res) {
            let status = JSON.parse(res.details.output);
            if (status.isConfigured) {
                showDashboard();
            } else {
                goToStep(1);
            }
        });
    });
}

function testConnection() {
    let apiKey = document.getElementById("api-key-input").value;
    document.getElementById("btn-test-connection").innerText = "Testing...";
    
    // Call standalone Deluge function to test API connection
    ZOHO.CRM.FUNCTIONS.execute("testFathomConnection", { "api_key": apiKey })
    .then(function(data) {
        let response = JSON.parse(data.details.output);
        if (response.success) {
            document.getElementById("btn-test-connection").classList.add("hidden");
            document.getElementById("connected-state").classList.remove("hidden");
            document.getElementById("account-name").innerText = response.accountName;
        } else {
            let errDiv = document.getElementById("connect-error");
            errDiv.innerText = "Invalid API key or couldn't reach Fathom.";
            errDiv.classList.remove("hidden");
            document.getElementById("btn-test-connection").innerText = "Test Connection";
        }
    });
}

function toggleDeskFields() {
    let isChecked = document.getElementById("desk-toggle").checked;
    document.getElementById("desk-fields").style.display = isChecked ? "flex" : "none";
}

function finishSetup() {
    // Show spinner overlay
    let overlay = document.getElementById("spinner-overlay");
    let spinnerText = document.getElementById("spinner-text");
    overlay.classList.remove("hidden");
    
    // Step-by-step progress messaging
    spinnerText.innerText = "Creating Meeting Notes module...";
    
    setTimeout(() => {
        spinnerText.innerText = "Configuring sync preferences...";
        
        // Gather all UI inputs into a map to pass to Deluge
        let configPayload = {
            sync_my: document.getElementById("sync-my").checked,
            sync_team: document.getElementById("sync-team").checked,
            transcript: document.getElementById("cap-transcript").checked,
            contact_match: document.getElementById("contact-matching").value
        };
        
        // Save options to Org Variables
        ZOHO.CRM.FUNCTIONS.execute("saveWizardPreferences", { "config": JSON.stringify(configPayload) });
    }, 1500);

    setTimeout(() => {
        spinnerText.innerText = "Connecting to Fathom...";
        
        // Fire the core function we built earlier to complete webhook registration!
        ZOHO.CRM.FUNCTIONS.execute("registerFathomWebhook", {}).then(function(result) {
            spinnerText.innerText = "Almost done...";
            setTimeout(() => {
                overlay.classList.add("hidden");
                showDashboard();
            }, 1000);
        });
    }, 3500);
}

function showDashboard() {
    document.querySelectorAll(".wizard-step").forEach(el => el.classList.add("hidden"));
    document.getElementById("dashboard").classList.remove("hidden");
    // Load your stats row and activity feed here via ZOHO.CRM.API.searchRecord
}

function goToStep(stepNum) {
    document.querySelectorAll(".wizard-step").forEach(el => el.classList.add("hidden"));
    document.getElementById("step-" + stepNum).classList.remove("hidden");
}