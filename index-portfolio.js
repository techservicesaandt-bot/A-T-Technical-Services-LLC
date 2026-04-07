(async function () {
    'use strict';
    
    // Fetch data.json to populate the portfolio cards
    let AT_SERVICES;
    try {
        const response = await fetch('data.json');
        AT_SERVICES = await response.json();
    } catch (e) {
        console.error("Failed to fetch data.json", e);
        return;
    }

    // Pick 6 featured projects to display in the Portfolio gallery runner
    const featuredProjects = [];
    const targetServices = ['events', 'fitout', 'exhibitions', 'branding', 'manufacturing', 'signages'];
    
    targetServices.forEach(s => {
        if(AT_SERVICES[s] && AT_SERVICES[s].projects.length > 0) {
            featuredProjects.push(AT_SERVICES[s].projects[0]);
        }
    });

    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack && featuredProjects.length > 0) {
        galleryTrack.innerHTML = ''; // clear existing static cards
        
        featuredProjects.forEach((proj, index) => {
            const card = document.createElement('div');
            card.className = 'g-card';
            card.setAttribute('tabindex', '0');
            card.dataset.index = index;
            
            card.innerHTML = `
                <img src="${proj.thumbnail}" alt="${proj.title}" loading="lazy">
                <div class="g-label"><span>${proj.title}</span><i class="fa-solid fa-magnifying-glass-plus"></i></div>
            `;
            
            card.addEventListener('click', () => openLightbox(index));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter') openLightbox(index);
            });
            
            galleryTrack.appendChild(card);
        });
    }

    // Lightbox Logic for Homepage
    const lightbox  = document.getElementById('lightbox');
    if (!lightbox) return; // If lightbox HTML isn't there, skip

    const lbBackdrop = document.getElementById('lbBackdrop');
    const lbClose   = document.getElementById('lbClose');
    const lbPrev    = document.getElementById('lbPrev');
    const lbNext    = document.getElementById('lbNext');
    const lbImage   = document.getElementById('lbImage');
    const lbLoading = document.getElementById('lbLoading');
    const lbCat     = document.getElementById('lbCat');
    const lbTitle   = document.getElementById('lbTitleText');
    const lbYear    = document.getElementById('lbYear');
    const lbLoc     = document.getElementById('lbLoc');
    const lbDesc    = document.getElementById('lbDesc');
    const lbCounter = document.getElementById('lbCounter');

    let currentProjectIndex = 0;
    let currentGalleryIndex = 0;

    function openLightbox(index) {
        currentProjectIndex = index;
        currentGalleryIndex = 0;
        renderSlide(currentProjectIndex, currentGalleryIndex);
        lightbox.hidden = false;
        lightbox.classList.add('lb-visible');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightbox.classList.remove('lb-visible');
        document.body.style.overflow = '';
    }

    function renderSlide(projIndex, galIndex) {
        const proj = featuredProjects[projIndex];
        const gallery = proj.gallery || [];
        const totalPhotos = gallery.length;
        const currentImgSrc = gallery[galIndex] || proj.thumbnail;

        lbLoading.classList.remove('hidden');
        lbImage.classList.add('loading');

        const img = new Image();
        img.src = currentImgSrc;
        img.onload = () => {
            lbImage.src = currentImgSrc;
            lbImage.alt = proj.title;
            lbImage.classList.remove('loading');
            lbLoading.classList.add('hidden');
        };
        img.onerror = () => lbLoading.classList.add('hidden');

        lbCat.textContent   = proj.category;
        lbTitle.textContent = proj.title;
        lbYear.innerHTML    = `<i class="fa-regular fa-calendar"></i> ${proj.year}`;
        lbLoc.innerHTML     = `<i class="fa-solid fa-location-dot"></i> ${proj.location}`;
        lbDesc.textContent  = proj.description;
        lbCounter.textContent = `${galIndex + 1} of ${totalPhotos}`;

        lbPrev.disabled = galIndex === 0;
        lbNext.disabled = galIndex === totalPhotos - 1;
    }

    function prevSlide() {
        if (currentGalleryIndex > 0) {
            currentGalleryIndex--;
            renderSlide(currentProjectIndex, currentGalleryIndex);
        }
    }

    function nextSlide() {
        const proj = featuredProjects[currentProjectIndex];
        const totalPhotos = proj.gallery ? proj.gallery.length : 1;
        if (currentGalleryIndex < totalPhotos - 1) {
            currentGalleryIndex++;
            renderSlide(currentProjectIndex, currentGalleryIndex);
        }
    }

    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prevSlide);
    lbNext.addEventListener('click', nextSlide);

    document.addEventListener('keydown', e => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   prevSlide();
        if (e.key === 'ArrowRight')  nextSlide();
    });
})();
