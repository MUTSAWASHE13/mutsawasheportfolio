import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3l_YHVcjLGBbuJdM_Hvgb3Q5kxefCJeE",
  authDomain: "receipt-cd873.firebaseapp.com",
  projectId: "receipt-cd873",
  storageBucket: "receipt-cd873.firebasestorage.app",
  messagingSenderId: "218056968166",
  appId: "1:218056968166:web:48c2f5faeba18c04d0f827"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Access Gateway System Auth Check Guard Controls
onAuthStateChanged(auth, (user) => {
    const modal = document.getElementById('authGateModal');
    if (user) {
        modal.style.display = "none"; // Hide login modal layer when verified session triggers
        synchronizeAdministrativeRegistries();
    } else {
        modal.style.display = "flex"; // Block interface operations
    }
});

// Execute Authentication System Session Request
document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    const fb = document.getElementById('authFeedback');
    
    if(!email || !password) { fb.innerText = "Missing input data values."; return; }
    
    try {
        fb.innerText = "Validating authority tokens...";
        await signInWithEmailAndPassword(auth, email, password);
    } catch(err) {
        fb.innerText = "Authentication failure: Access revoked. " + err.message;
    }
});

// Secure Log-out Route Link Trigger Execution
document.getElementById('logoutBtn').addEventListener('click', () => { signOut(auth); });

// Update Form Input Configurations to reflect accurate targets
document.getElementById('contentType').addEventListener('change', (e) => {
    const selection = e.target.value;
    document.getElementById('titleGroupContainer').style.display = "block";
    document.getElementById('subtitleGroupContainer').style.display = "block";
    document.getElementById('descGroupContainer').style.display = "block";
    document.getElementById('fileGroupContainer').style.display = "block";

    if (selection === "profile_pic" || selection === "cv") {
        document.getElementById('titleGroupContainer').style.display = "none";
        document.getElementById('subtitleGroupContainer').style.display = "none";
        document.getElementById('descGroupContainer').style.display = "none";
        document.getElementById('fileLabel').innerText = selection === "cv" ? "Upload Curriculum Vitae (PDF Document Target)" : "Upload Avatar Graphic Element Image File";
    } else if (selection === "biography") {
        document.getElementById('titleGroupContainer').style.display = "none";
        document.getElementById('subtitleGroupContainer').style.display = "none";
        document.getElementById('fileGroupContainer').style.display = "none";
        document.getElementById('descLabel').innerText = "Biography text string core context definition data";
    } else if (selection === "skills") {
        document.getElementById('fileGroupContainer').style.display = "none";
        document.getElementById('titleLabel').innerText = "Technical Skill / Field Designation";
        document.getElementById('subtitleLabel').innerText = "Competence Metrics Rating (e.g., Expert, Advanced, Intermediate)";
        document.getElementById('descGroupContainer').style.display = "none";
    }
});

// Synchronize Admin Matrix Elements Lists Registers
async function synchronizeAdministrativeRegistries() {
    const cRegistry = document.getElementById('adminContentRegistry');
    const iInbox = document.getElementById('adminInboxRegistry');
    cRegistry.innerHTML = "<p class='loading-text'>Pulling registries indexes maps...</p>";
    iInbox.innerHTML = "<p class='loading-text'>Streaming inquiries data lines...</p>";

    try {
        cRegistry.innerHTML = "";
        const targetCollections = ["biography", "profile_pic", "cv", "skills", "projects", "experience", "education", "credentials"];
        
        for (const colName of targetCollections) {
            const snap = await getDocs(query(collection(db, colName), orderBy("timestamp", "desc")));
            snap.forEach((entry) => {
                const data = entry.data();
                let displayTitle = data.title || `${colName} component data record block`;
                cRegistry.innerHTML += `
                    <div class="registry-row-item">
                        <div>
                            <span style="font-size:0.75rem; color: var(--neon-rose); font-weight:bold; text-transform:uppercase;">[${colName}]</span>
                            <h4 style="margin-top:2px; font-size: 0.9rem;">${displayTitle}</h4>
                        </div>
                        <button class="decom-btn" data-collection="${colName}" data-id="${entry.id}">Delete</button>
                    </div>
                `;
            });
        }

        const inquiriesSnap = await getDocs(query(collection(db, "visitor_inquiries"), orderBy("timestamp", "desc")));
        iInbox.innerHTML = "";
        if(inquiriesSnap.empty) iInbox.innerHTML = "<p class='loading-text'>Inbox streaming line empty.</p>";
        
        inquiriesSnap.forEach((msg) => {
            const data = msg.data();
            iInbox.innerHTML += `
                <div class="inbox-msg-card">
                    <div style="width:100%; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-grid); padding-bottom:6px;">
                        <div>
                            <strong style="color: var(--neon-emerald); font-size: 0.9rem;">${data.senderName}</strong> 
                            <span style="font-size:0.8rem; color: var(--text-dark-mute);">(${data.senderEmail})</span>
                        </div>
                        <button class="decom-btn" data-collection="visitor_inquiries" data-id="${msg.id}">Delete</button>
                    </div>
                    <p style="margin-top:4px; font-style:italic; font-size: 0.9rem; color: var(--text-terminal); width:100%;">${data.message}</p>
                </div>
            `;
        });

        document.querySelectorAll('.decom-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const targetCol = e.target.getAttribute('data-collection');
                if (confirm("Confirm database record drop execution lifecycle context element command?")) {
                    await deleteDoc(doc(db, targetCol, id));
                    synchronizeAdministrativeRegistries();
                }
            });
        });

    } catch (err) {
        console.error("Dashboard engine rendering breakdown: ", err);
    }
}

// Refactored Upload Core Form Processor: Stripped Base64, Streaming Straight via Firebase Storage Buckets
document.getElementById('publishBtn').addEventListener('click', async () => {
    const colName = document.getElementById('contentType').value;
    const title = document.getElementById('contentTitle').value.trim();
    const subtitle = document.getElementById('contentSubtitle').value.trim();
    const desc = document.getElementById('contentDesc').value.trim();
    const fileRef = document.getElementById('contentFile').files[0];
    const btn = document.getElementById('publishBtn');

    btn.disabled = true;
    btn.innerText = "Streaming asset file bytes to bucket structure...";

    try {
        let storageFileUrl = "";

        if (fileRef) {
            const fileStoragePathRef = ref(storage, `portfolio_assets/${Date.now()}_${fileRef.name}`);
            const uploadSnapshot = await uploadBytes(fileStoragePathRef, fileRef);
            storageFileUrl = await getDownloadURL(uploadSnapshot.ref);
        }

        const artifactRecordPayload = {
            title: title || "Consolidated Record Block",
            subtitle: subtitle || "",
            description: desc || "",
            fileUrl: storageFileUrl,
            timestamp: new Date()
        };

        await addDoc(collection(db, colName), artifactRecordPayload);
        
        document.getElementById('contentTitle').value = '';
        document.getElementById('contentSubtitle').value = '';
        document.getElementById('contentDesc').value = '';
        document.getElementById('contentFile').value = '';

        alert("Database structure entity write pipeline executed flawlessly.");
        synchronizeAdministrativeRegistries();

    } catch (err) {
        alert("Pipeline operation aborted write fault: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Publish Entry";
    }
});