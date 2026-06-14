import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Helper input scrubbing sanitization logic against XSS injection vulnerabilities
function sanitizeDataInjection(rawString) {
    const nodeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;' };
    return String(rawString).replace(/[&<>"'/]/g, (match) => nodeMap[match]);
}

// Optimized individual isolated collections execution queries pipeline loop
async function ingestIsolatedCollections() {
    try {
        // [1] Stream dynamic biography summary profile
        const qBio = query(collection(db, "biography"), orderBy("timestamp", "desc"), limit(1));
        const bioSnap = await getDocs(qBio);
        const bioBox = document.getElementById('dynamicIntroContainer');
        if(!bioSnap.empty) {
            bioBox.innerHTML = `<p>${sanitizeDataInjection(bioSnap.docs[0].data().description)}</p>`;
        } else {
            bioBox.innerHTML = `<p>Computer Systems Engineer specialized in institutional healthcare IT infrastructure networks, database tracking architecture, and localized system administration workflows.</p>`;
        }

        // [2] Stream profile image asset avatar
        const qPic = query(collection(db, "profile_pic"), orderBy("timestamp", "desc"), limit(1));
        const picSnap = await getDocs(qPic);
        if(!picSnap.empty) {
            document.getElementById('profilePicContainer').innerHTML = `<img src="${picSnap.docs[0].data().fileUrl}" class="profile-avatar-img" alt="Eng. Mutsawashe Abel Muchakaviri">`;
        }

        // [3] Stream target CV document access asset url download frame
        const qCv = query(collection(db, "cv"), orderBy("timestamp", "desc"), limit(1));
        const cvSnap = await getDocs(qCv);
        if(!cvSnap.empty) {
            document.getElementById('cvDownloadContainer').innerHTML = `<a href="${cvSnap.docs[0].data().fileUrl}" download="Eng_Mutsawashe_Abel_Muchakaviri_CV.pdf" target="_blank" class="cv-download-btn">📄 Download My CV</a>`;
        }

        // [4] Pull Skills Data Registry Matrix
        const skillSnap = await getDocs(query(collection(db, "skills"), orderBy("timestamp", "desc")));
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = "";
        if(skillSnap.empty) {
            skillsContainer.innerHTML = "<p class='loading-text'>No active skills matrix entries cataloged yet.</p>";
        } else {
            skillSnap.forEach((doc) => {
                const item = doc.data();
                const level = item.subtitle.toLowerCase();
                let badgeClass = "tier-intermediate";
                if(level.includes("expert") || level.includes("master")) badgeClass = "tier-expert";
                if(level.includes("advance")) badgeClass = "tier-advanced";

                skillsContainer.innerHTML += `
                    <div class="skill-matrix-item-row">
                        <span class="skill-item-name">${sanitizeDataInjection(item.title)}</span>
                        <span class="skill-metric-badge-node ${badgeClass}">${sanitizeDataInjection(item.subtitle)}</span>
                    </div>
                `;
            });
        }

        // [5] Pull Projects Matrix Data
        const projSnap = await getDocs(query(collection(db, "projects"), orderBy("timestamp", "desc")));
        const projGrid = document.getElementById('projectsGrid');
        projGrid.innerHTML = "";
        projSnap.forEach((doc) => {
            const item = doc.data();
            let attachmentFrame = item.fileUrl ? `<div class="media-wrapper"><img src="${item.fileUrl}" class="live-img-view" alt="Project Asset"></div>` : "";
            projGrid.innerHTML += `
                <article class="project-card">
                    <div>
                        <span class="tag-badge">${sanitizeDataInjection(item.subtitle || 'System Deployment')}</span>
                        <h3>${sanitizeDataInjection(item.title)}</h3>
                        <p>${sanitizeDataInjection(item.description)}</p>
                    </div>
                    ${attachmentFrame}
                </article>
            `;
        });

        // [6] Pull Professional Experience Record Streams
        const expSnap = await getDocs(query(collection(db, "experience"), orderBy("timestamp", "desc")));
        const expBox = document.getElementById('experienceTimeline');
        expBox.innerHTML = "";
        expSnap.forEach((doc) => {
            const item = doc.data();
            let attachmentFrame = item.fileUrl ? `<div class="media-wrapper"><a href="${item.fileUrl}" target="_blank" class="doc-button">📂 View Verification Document</a></div>` : "";
            expBox.innerHTML += `
                <div class="list-entry-card" style="border-left: 4px solid var(--neon-emerald);">
                    <span class="tag-badge" style="color: var(--neon-emerald); background: rgba(52, 211, 153, 0.08); border-color: rgba(52, 211, 153, 0.15);">${sanitizeDataInjection(item.subtitle)}</span>
                    <h3>${sanitizeDataInjection(item.title)}</h3>
                    <p>${sanitizeDataInjection(item.description)}</p>
                    ${attachmentFrame}
                </div>
            `;
        });

        // [7] Pull Education Elements
        const eduSnap = await getDocs(query(collection(db, "education"), orderBy("timestamp", "desc")));
        const eduBox = document.getElementById('educationTimeline');
        eduBox.innerHTML = "";
        eduSnap.forEach((doc) => {
            const item = doc.data();
            eduBox.innerHTML += `
                <div class="list-entry-card" style="border-left: 4px solid var(--neon-blue);">
                    <span class="tag-badge">${sanitizeDataInjection(item.subtitle)}</span>
                    <h3>${sanitizeDataInjection(item.title)}</h3>
                    <p>${sanitizeDataInjection(item.description)}</p>
                </div>
            `;
        });

        // [8] Pull Certifications
        const certSnap = await getDocs(query(collection(db, "credentials"), orderBy("timestamp", "desc")));
        const certBox = document.getElementById('awardsContainer');
        certBox.innerHTML = "";
        certSnap.forEach((doc) => {
            const item = doc.data();
            let attachmentFrame = item.fileUrl ? `<div class="media-wrapper"><a href="${item.fileUrl}" target="_blank" class="doc-button">📂 View Verified Certificate</a></div>` : "";
            certBox.innerHTML += `
                <div class="project-card">
                    <div>
                        <span class="tag-badge">Credential Record</span>
                        <h3>${sanitizeDataInjection(item.title)}</h3>
                        <span style="font-size:0.85rem; color:var(--neon-blue); display:block; margin-bottom:10px;">Authority: ${sanitizeDataInjection(item.subtitle)}</span>
                        <p>${sanitizeDataInjection(item.description)}</p>
                    </div>
                    ${attachmentFrame}
                </div>
            `;
        });

    } catch (error) {
        console.error("Infrastructure synchronization fault error payload: ", error);
    }
}

// Messaging Write-Only Node Transmission execution block
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sBtn = document.getElementById('contactSubmitBtn');
    const statusDiv = document.getElementById('formStatus');

    const name = document.getElementById('visitorName').value.trim();
    const email = document.getElementById('visitorEmail').value.trim();
    const msg = document.getElementById('visitorMessage').value.trim();

    sBtn.disabled = true;
    sBtn.innerText = "Transmitting message logs packets...";

    try {
        await addDoc(collection(db, "visitor_inquiries"), {
            senderName: sanitizeDataInjection(name),
            senderEmail: sanitizeDataInjection(email),
            message: sanitizeDataInjection(msg),
            timestamp: new Date()
        });

        statusDiv.innerHTML = "<span style='color: var(--neon-emerald); font-weight: bold;'>✓ Success: Message logged securely in administrator node console registry stream.</span>";
        document.getElementById('contactForm').reset();
    } catch (err) {
        statusDiv.innerHTML = `<span style='color: var(--neon-rose); font-weight: bold;'>Transmission anomaly encountered: ${err.message}</span>`;
    } finally {
        sBtn.disabled = false;
        sBtn.innerText = "Send Message";
    }
});

window.addEventListener('DOMContentLoaded', ingestIsolatedCollections);