/**
 * content-loader.js
 * Fetches the 6 section JSON files (written by Decap CMS into /content/)
 * and renders them into the page's containers. Missing containers are
 * skipped, so this one script is safe to include on any page.
 */

const CONTENT_BASE = "content";

async function loadJSON(path) {
  try {
    const res = await fetch(`${CONTENT_BASE}/${path}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function emptyNote(text) {
  return `<p class="empty-note">${text}</p>`;
}

/* ---------------------------------------------------------
   1. HOME & ABOUT ME
--------------------------------------------------------- */
async function renderHomeAbout() {
  if (!document.getElementById("home-about-section")) return;
  const data = await loadJSON("home-about.json");
  if (!data) return;

  const photoImg = document.getElementById("about-photo");
  if (photoImg) {
    if (data.photo) { photoImg.src = data.photo; }
    else { photoImg.closest(".hero-photo-frame").style.display = "none"; }
  }

  const nameEl = document.getElementById("about-name");
  if (nameEl) nameEl.textContent = data.name || "Your Name";

  const taglineEl = document.getElementById("about-tagline");
  if (taglineEl) taglineEl.textContent = data.tagline || "";

  const summaryEl = document.getElementById("about-summary");
  if (summaryEl) summaryEl.innerHTML = `<p>${(data.summary || "").replace(/\n/g, "<br>")}</p>`;

  const resumeEl = document.getElementById("about-resume-link");
  if (resumeEl && data.resume) {
    resumeEl.href = data.resume;
    resumeEl.style.display = "inline-block";
  }

  const socialContainer = document.getElementById("about-social-links");
  if (socialContainer && Array.isArray(data.social_links)) {
    data.social_links.forEach(link => {
      const a = el("a", "", link.platform);
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      socialContainer.appendChild(a);
    });
  }
}

/* ---------------------------------------------------------
   2. EDUCATION & CERTIFICATIONS
--------------------------------------------------------- */
async function renderEducationCertifications() {
  if (!document.getElementById("education-certifications-section")) return;
  const data = await loadJSON("education-certifications.json");
  if (!data) return;

  const eduList = document.getElementById("education-list");
  if (eduList) {
    if (!data.education || !data.education.length) {
      eduList.innerHTML = emptyNote("Add your education history in the CMS.");
    } else {
      eduList.innerHTML = "";
      data.education.forEach(item => {
        const card = el("div", "panel");
        card.innerHTML = `
          <h3>${item.degree || ""}</h3>
          <p class="meta">${item.institution || ""}${item.location ? " — " + item.location : ""}</p>
          ${(item.start_date || item.end_date) ? `<p class="dates">${formatDate(item.start_date)}${item.end_date ? " – " + formatDate(item.end_date) : ""}</p>` : ""}
          ${item.description ? `<div class="desc"><p>${item.description}</p></div>` : ""}
        `;
        eduList.appendChild(card);
      });
    }
  }

  const certList = document.getElementById("certifications-list");
  if (certList) {
    if (!data.certifications || !data.certifications.length) {
      certList.innerHTML = emptyNote("Add certifications in the CMS.");
    } else {
      certList.innerHTML = "";
      data.certifications.forEach(item => {
        const card = el("div", "panel cert-item");
        card.innerHTML = `
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="cert-badge">` : ""}
          <div>
            <h4>${item.title || ""}</h4>
            <p class="meta">${item.issuer || ""}${item.date ? " · " + formatDate(item.date) : ""}</p>
            ${item.credential_url ? `<a href="${item.credential_url}" target="_blank" rel="noopener">View credential</a>` : ""}
          </div>
        `;
        certList.appendChild(card);
      });
    }
  }

  const trainingList = document.getElementById("training-list");
  const trainingSub = document.getElementById("training-subsection");
  if (trainingList) {
    if (!data.training || !data.training.length) {
      if (trainingSub) trainingSub.style.display = "none";
    } else {
      if (trainingSub) trainingSub.style.display = "";
      trainingList.innerHTML = "";
      data.training.forEach(item => {
        const card = el("div", "panel");
        card.innerHTML = `
          <h4>${item.title || ""}</h4>
          <p class="meta">${item.provider || ""}${item.date ? " · " + formatDate(item.date) : ""}</p>
          ${item.description ? `<div class="desc"><p>${item.description}</p></div>` : ""}
          ${item.attachment ? `<a href="${item.attachment}" target="_blank" rel="noopener">Certificate</a>` : ""}
        `;
        trainingList.appendChild(card);
      });
    }
  }
}

/* ---------------------------------------------------------
   3. RESEARCH & PUBLICATIONS
--------------------------------------------------------- */
async function renderResearchPublications() {
  if (!document.getElementById("research-publications-section")) return;
  const data = await loadJSON("research-publications.json");
  if (!data) return;

  const researchList = document.getElementById("research-list");
  if (researchList) {
    if (!data.research || !data.research.length) {
      researchList.innerHTML = emptyNote("Add research entries in the CMS.");
    } else {
      researchList.innerHTML = "";
      data.research.forEach(item => {
        const card = el("div", "panel");
        card.innerHTML = `
          <h4>${item.title || ""}</h4>
          <p class="meta">${item.area || ""}${item.date ? " · " + formatDate(item.date) : ""}</p>
          ${item.collaborators && item.collaborators.length ? `<p class="meta">With ${item.collaborators.join(", ")}</p>` : ""}
          ${item.description ? `<div class="desc"><p>${item.description}</p></div>` : ""}
          ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">Learn more</a>` : ""}
        `;
        researchList.appendChild(card);
      });
    }
  }

  const pubList = document.getElementById("publications-list");
  if (pubList) {
    const pubs = (data.publications || []).filter(p => p.title);
    if (!pubs.length) {
      pubList.innerHTML = emptyNote("Add publications in the CMS.");
    } else {
      pubList.innerHTML = "";
      pubs.forEach(item => {
        const card = el("div", "panel");
        card.innerHTML = `
          <h4>${item.title}</h4>
          <p class="meta">${item.venue || ""}${item.date ? " · " + formatDate(item.date) : ""}</p>
          ${item.authors && item.authors.length ? `<p class="meta">${item.authors.join(", ")}</p>` : ""}
          ${item.abstract ? `<div class="desc"><p>${item.abstract}</p></div>` : ""}
          ${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">Read paper</a>` : ""}
        `;
        pubList.appendChild(card);
      });
    }
  }
}

/* ---------------------------------------------------------
   4. EXPERIENCE & PROJECTS
--------------------------------------------------------- */
async function renderExperienceProjects() {
  if (!document.getElementById("experience-projects-section")) return;
  const data = await loadJSON("experience-projects.json");
  if (!data) return;

  const expList = document.getElementById("experience-list");
  if (expList) {
    if (!data.experience || !data.experience.length) {
      expList.innerHTML = emptyNote("Add work experience in the CMS.");
    } else {
      expList.innerHTML = "";
      data.experience.forEach(item => {
        const endLabel = item.current ? "Present" : (formatDate(item.end_date) || "");
        const card = el("div", "panel");
        card.innerHTML = `
          <h3>${item.title || ""}</h3>
          <p class="meta">${item.company || ""}${item.location ? " — " + item.location : ""}</p>
          ${(item.start_date || endLabel) ? `<p class="dates">${formatDate(item.start_date)} – ${endLabel}</p>` : ""}
          ${item.description ? `<div class="desc"><p>${item.description}</p></div>` : ""}
        `;
        expList.appendChild(card);
      });
    }
  }

  const projList = document.getElementById("projects-list");
  if (projList) {
    if (!data.projects || !data.projects.length) {
      projList.innerHTML = emptyNote("Add projects in the CMS.");
    } else {
      projList.innerHTML = "";
      data.projects.forEach(item => {
        const card = el("div", "panel project-item");
        card.innerHTML = `
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="project-image">` : ""}
          <h3>${item.title || ""}</h3>
          <p class="meta">${item.summary || ""}</p>
          ${item.tech_stack && item.tech_stack.length ? `<div class="tech-stack">${item.tech_stack.map(t => `<span class="tag">${t}</span>`).join("")}</div>` : ""}
          ${item.description ? `<div class="desc"><p>${item.description}</p></div>` : ""}
          <div class="project-links">
            ${item.repo_link ? `<a href="${item.repo_link}" target="_blank" rel="noopener">Code</a>` : ""}
            ${item.demo_link ? `<a href="${item.demo_link}" target="_blank" rel="noopener">Live demo</a>` : ""}
          </div>
        `;
        projList.appendChild(card);
      });
    }
  }
}

/* ---------------------------------------------------------
   5. SKILLS & HOBBIES
--------------------------------------------------------- */
async function renderSkillsHobbies() {
  if (!document.getElementById("skills-hobbies-section")) return;
  const data = await loadJSON("skills-hobbies.json");
  if (!data) return;

  const skillsList = document.getElementById("skills-list");
  if (skillsList) {
    if (!data.skills || !data.skills.length) {
      skillsList.innerHTML = emptyNote("Add skills in the CMS.");
    } else {
      skillsList.innerHTML = "";
      const byCategory = {};
      data.skills.forEach(s => {
        const cat = s.category || "Other";
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(s);
      });
      Object.keys(byCategory).forEach(cat => {
        const group = el("div", "skill-group");
        const tagsHtml = byCategory[cat]
          .map(s => `<span class="skill-tag">${s.name}${s.level ? ` <small>(${s.level})</small>` : ""}</span>`)
          .join("");
        group.innerHTML = `<h4>${cat}</h4><div class="skill-tags">${tagsHtml}</div>`;
        skillsList.appendChild(group);
      });
    }
  }

  const hobbiesList = document.getElementById("hobbies-list");
  const hobbiesSub = document.getElementById("hobbies-subsection");
  if (hobbiesList) {
    if (!data.hobbies || !data.hobbies.length) {
      if (hobbiesSub) hobbiesSub.style.display = "none";
    } else {
      if (hobbiesSub) hobbiesSub.style.display = "";
      hobbiesList.innerHTML = "";
      data.hobbies.forEach(item => {
        const card = el("div", "hobby-item");
        card.innerHTML = `<h4>${item.name || ""}</h4>${item.description ? `<p>${item.description}</p>` : ""}`;
        hobbiesList.appendChild(card);
      });
    }
  }
}

/* ---------------------------------------------------------
   6. CONTACT & COLLABORATION
--------------------------------------------------------- */
async function renderContact() {
  if (!document.getElementById("contact-section")) return;
  const data = await loadJSON("contact.json");
  if (!data) return;

  const emailEl = document.getElementById("contact-email");
  if (emailEl) {
    if (data.email) {
      emailEl.textContent = data.email;
      emailEl.href = `mailto:${data.email}`;
    } else {
      emailEl.closest(".field").style.display = "none";
    }
  }
  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl) {
    if (data.phone) phoneEl.textContent = data.phone;
    else phoneEl.closest(".field").style.display = "none";
  }
  const locationEl = document.getElementById("contact-location");
  if (locationEl) {
    if (data.location) locationEl.textContent = data.location;
    else locationEl.closest(".field").style.display = "none";
  }

  const availabilityEl = document.getElementById("contact-availability");
  if (availabilityEl) availabilityEl.textContent = data.availability || "";

  const collabEl = document.getElementById("contact-collaboration-note");
  if (collabEl && data.collaboration_note) {
    collabEl.innerHTML = `<p>${data.collaboration_note.replace(/\n/g, "<br>")}</p>`;
  }

  const linksContainer = document.getElementById("contact-links");
  if (linksContainer && Array.isArray(data.links)) {
    data.links.forEach(link => {
      const a = el("a", "", link.platform);
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      linksContainer.appendChild(a);
    });
  }
}

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHomeAbout();
  renderEducationCertifications();
  renderResearchPublications();
  renderExperienceProjects();
  renderSkillsHobbies();
  renderContact();
});
