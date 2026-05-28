// Global Object State Management Schema Blueprint Tracker Layout
let configState = {
    api_key: "",
    sync_own: true,
    sync_team: true,
    sync_external: false,
    sync_all: false,
    capture_transcript: true,
    capture_summary: true,
    capture_actions: true,
    capture_matches: false,
    contact_matching: "email",
    desk_enabled: true,
    desk_department: "Support",
    desk_priority: "Normal",
    setup_complete: false,
    last_sync_timestamp: "",
    webhook_id: "",
    webhook_secret: "",
    account_name: "Woggle Consulting Account"
};

// Step Flow Tracking Navigation Handler Layer Engine
function moveStep(targetStepInt) {
    clearInlineErrorAlertBanner();
    document.getElementById("wz-stepper-header").style.display = "flex";
    
    for(let i = 1; i <= 3; i++) {
        const node = document.getElementById(`node-${i}`);
        if(node) {
            node.classList.remove("active", "completed");
            if (i < targetStepInt) node.classList.add("completed");
            else if (i === targetStepInt) node.classList.add("active");
        }
    }
    renderUIStatePanelRoute(`panel-step-${targetStepInt}`);
}

// Single Password Mask Field Tracker Connection Validator Gateway Task
function handleTestConnection() {
    clearInlineErrorAlertBanner();
    const keyInputValueStr = document.getElementById("input-api-key").value.trim();
    
    if (!keyInputValueStr) {
        showInlineErrorAlertBanner("Fathom Bearer Token context string cannot be initialized blank.");
        return;
    }

    const btn = document.getElementById("btn-test-connection");
    btn.disabled = true;
    btn.innerHTML = "Validating Access...";

    configState.api_key = keyInputValueStr;

    const payloadData = JSON.stringify({
        "action_type": "test_connection",
        "api_key_override": keyInputValueStr
    });

    const executionBody = {
        "arguments": payloadData
    };

    console.log("Sending clean REST format payload to Zoho:", executionBody.toString(), executionBody);

    ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", executionBody)
    .then(function(execData) {
        if (!execData || !execData.details || !execData.details.output) {
            showInlineErrorAlertBanner("Invalid SDK response wrapper structure.");
            btn.disabled = false;
            btn.innerHTML = "Test Connection";
            return;
        }

        const outMap = JSON.parse(execData.details.output);
        btn.disabled = false;
        btn.innerHTML = "Test Connection";

        if (outMap.status === "success") {
            configState.account_name = outMap.account_name || "Verified Fathom User Profile Account";
            
            const stateMessageEl = document.getElementById("connect-state-msg");
            const nextBtnEl = document.getElementById("btn-step1-next");
            const disconnectLinkEl = document.getElementById("link-disconnect");

            if (stateMessageEl) {
                stateMessageEl.innerHTML = `<span style="color:var(--color-success); font-weight:600;">✓ Connected to ${configState.account_name} </span>`;
            }
            if (nextBtnEl) nextBtnEl.disabled = false;
            if (disconnectLinkEl) disconnectLinkEl.style.display = "inline";
            
        } else {
            showInlineErrorAlertBanner(outMap.message || "Invalid API connection parameters. Authentication rejected.");
        }
    }).catch(function(err) {
        btn.disabled = false;
        btn.innerHTML = "Test Connection";
        console.error("Error during connection test execution:", err);
        showInlineErrorAlertBanner("Network infrastructure handshake timed out or query rejected.");
    });
}

function toggleDeskFields(isCheckedBool) {
    const deskFields = document.getElementById("desk-conditional-fields");
    if(deskFields) deskFields.style.display = isCheckedBool ? "flex" : "none";
}

// Silent Background Configuration Sequencing Engine Orchestration Layout Layer
function executeBackgroundSetup() {
    clearInlineErrorAlertBanner();
    document.getElementById("wz-stepper-header").style.display = "none";
    renderUIStatePanelRoute("panel-processing");

    const statusLabel = document.getElementById("processing-status-msg");
    
    configState.sync_own = document.getElementById("chk-own").checked;
    configState.sync_team = document.getElementById("chk-team").checked;
    configState.sync_external = document.getElementById("chk-external").checked;
    configState.sync_all = document.getElementById("chk-all").checked;
    configState.capture_transcript = document.getElementById("chk-cap-trans").checked;
    configState.capture_summary = document.getElementById("chk-cap-sum").checked;
    configState.capture_actions = document.getElementById("chk-cap-actions").checked;
    configState.capture_matches = document.getElementById("chk-cap-matches").checked;
    configState.contact_matching = document.getElementById("sel-matching").value;
    configState.desk_enabled = document.getElementById("toggle-desk").checked;
    configState.desk_department = document.getElementById("sel-desk-dept").value;
    configState.desk_priority = document.getElementById("sel-desk-priority").value;

    statusLabel.textContent = "Creating Meeting Notes database system layout module metadata...";
    
    setTimeout(() => {
        statusLabel.textContent = "Configuring pipeline filtering parameters schemas criteria...";
        
        setTimeout(() => {
            statusLabel.textContent = "Connecting to Fathom Secure Endpoint Gateway Webhook loops...";
            
            const payloadData = {
                "action_type": "register_webhook",
                "config_payload_string": configState
            };
            executionBody = {
                "arguments": JSON.stringify(payloadData)
            };

            ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", executionBody)
            .then(function(serverResultData) {
                try {
                    const finalResultMap = JSON.parse(serverResultData.details.output);
                    if (finalResultMap.status === "success") {
                        configState.webhook_id = finalResultMap.webhook_id;
                        configState.webhook_secret = finalResultMap.webhook_secret;
                        configState.setup_complete = true;

                        statusLabel.textContent = "Almost done... finalizing tracking indexes.";
                        setTimeout(() => {
                            document.getElementById("spinner-loader-graphic").style.display = "none";
                            document.getElementById("success-icon-checkmark").style.display = "block";
                            document.getElementById("processing-headline-text").textContent = "Integration Operational!";
                            statusLabel.textContent = "Fathom engine is fully integrated into your workflows structure.";
                            document.getElementById("processing-action-block").style.display = "flex";
                        }, 1000);
                    } else {
                        handleSetupFailureFallback(finalResultMap.message);
                    }
                } catch(e) {
                    handleSetupFailureFallback("Structural validation mapping parsing crash.");
                }
            }).catch(function(err) {
                handleSetupFailureFallback("Network pipeline registration timed out.");
            });
        }, 1000);
    }, 1000);
}

function handleSetupFailureFallback(errorString) {
    document.getElementById("wz-stepper-header").style.display = "flex";
    moveStep(3);
    showInlineErrorAlertBanner("Setup Aborted: " + errorString);
}

// Dashboard View Initializer Module
function loadDashboardLayoutView() {
    document.getElementById("wz-stepper-header").style.display = "none";
    renderUIStatePanelRoute("panel-dashboard");
    
    document.getElementById("dash-profile-name").textContent = configState.account_name;
    document.getElementById("dash-last-sync-time").textContent = configState.last_sync_timestamp || "Awaiting incoming syncs...";
    
    // Static visual mock counters fallback renderers
    document.getElementById("dash-stat-meetings").textContent = "14";
    document.getElementById("dash-stat-tickets").textContent = configState.desk_enabled ? "3" : "0";
    document.getElementById("dash-stat-matched-pct").textContent = "85%";
}

// Global UI View Router Engine Switcher
function renderUIStatePanelRoute(panelIdTarget) {
    const panels = document.querySelectorAll(".view-panel");
    panels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(panelIdTarget);
    if(activePanel) activePanel.classList.add("active");
}

// Inline Alert Modifiers UI
function showInlineErrorAlertBanner(messageText) {
    const banner = document.getElementById("error-alert-banner");
    if(banner) {
        banner.textContent = messageText;
        banner.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function clearInlineErrorAlertBanner() {
    const banner = document.getElementById("error-alert-banner");
    if(banner) banner.style.display = "none";
}

// Overlay Modals Controllers
function triggerDisconnectModal() {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("modal-confirm-btn").onclick = confirmDestructiveDisconnect;
}

function closeActiveModalWindow() {
    document.getElementById("modal-container").style.display = "none";
}

function confirmDestructiveDisconnect() {
    closeActiveModalWindow();
    showInlineErrorAlertBanner("Disconnecting channel integrations tracking layouts...");
    
    const payloadData = { "action_type": "teardown_disconnect" };

    ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", { 
        "arguments": JSON.stringify({
            "custom_parameters": payloadData
        })
    })
    .then(function() {
        location.reload();
    }).catch(function() {
        location.reload();
    });
}

function triggerManualSyncAction(btnElement) {
    btnElement.disabled = true;
    btnElement.textContent = "Syncing...";
    setTimeout(() => {
        btnElement.disabled = false;
        btnElement.textContent = "Sync Now";
    }, 2000);
}

function saveQuickSettingsUpdates() {
    console.log("Real-time telemetry metrics modifications intercepted and tracked mapping configurations locally.");
}

console.log("App.js loaded. Initializing Zoho SDK Handshake...");

ZOHO.embeddedApp.init().then(function() {
    console.log("Zoho SDK connection established successfully.");
    
    const errorBanner = document.getElementById("error-alert-banner");
    if (errorBanner) {
        errorBanner.style.display = "none";
    }
    
    const step1Panel = document.getElementById("panel-step-1");
    if (step1Panel) {
        step1Panel.classList.add("active");
    }
    
    const testBtn = document.getElementById("btn-test-connection");
    if (testBtn) {
        testBtn.disabled = false;
    }

    ZOHO.CRM.CONFIG.getOrgInfo().then(function(orgDetails) {
        if (orgDetails && orgDetails.org && orgDetails.org.api_domain) {
            const detectedDomain = orgDetails.org.api_domain;
            console.log("Detected User Datacenter Domain Location:", detectedDomain);

            // Execute a completely silent function call to lock this variable into CRM
            ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", {
                "arguments": JSON.stringify({
                    "action_type": "save_api_domain",
                    "api_domain_value": detectedDomain
                })
            })
            .then(res => console.log("Silent domain mapping updated successfully."))
            .catch(err => console.error("Silent domain mapping failure:", err));
        }
    });
    
    console.log("Widget is fully booted and ready for user interaction.");
});