document.addEventListener('DOMContentLoaded', function() {

    let allCards = Array.from(document.querySelectorAll('.product-card'));
    let noResultsBox = document.getElementById('noResults');
    let activeFiltersBox = document.getElementById('activeFilters');
    let clearBtn = document.getElementById('clearAllFilters');

    let currentFilters = {
        category: 'all',
        farmer: 'all',
        price: 'all',
        sort: 'popular'
    };

    let dropdowns = document.querySelectorAll('.filter-item.dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        let item = dropdowns[i];
        item.addEventListener('click', function(e) {
            let wasOpen = item.classList.contains('is-open');
            let openDrops = document.querySelectorAll('.filter-item.dropdown.is-open');
            openDrops.forEach(function(d) { d.classList.remove('is-open'); });

            if (!wasOpen) {
                item.classList.add('is-open');
            }
            e.stopPropagation();
        });

        let options = item.querySelectorAll('.dropdown-opt');
        options.forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                let filterType = item.getAttribute('data-filter');
                let val = opt.getAttribute('data-value');
                currentFilters[filterType] = val;

                item.querySelectorAll('.dropdown-opt').forEach(function(o) {
                    o.classList.remove('is-active');
                });
                opt.classList.add('is-active');

                let label = item.querySelector('.filter-label');
                if (val === 'all') {
                    if (filterType === 'sort') {
                        label.textContent = 'Sort by';
                    } else {
                        label.textContent = filterType.charAt(0).toUpperCase() + filterType.slice(1);
                    }
                } else {
                    label.textContent = opt.textContent.trim();
                }

                item.classList.remove('is-open');
                runFilters();
            });
        });
    }

    document.addEventListener('click', function() {
        document.querySelectorAll('.filter-item.dropdown.is-open').forEach(function(d) {
            d.classList.remove('is-open');
        });
    });

    let priceBtns = document.querySelectorAll('.price-seg');
    priceBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            priceBtns.forEach(function(b) {
                b.classList.remove('is-active');
            });
            btn.classList.add('is-active');
            currentFilters.price = btn.getAttribute('data-value');
            runFilters();
        });
    });

    function runFilters() {
        if (openedCardState) {
            closeCard(true);
        }

        let minPrice = 0;
        let maxPrice = 999999;

        let visibleCards = [];

        for (let i = 0; i < allCards.length; i++) {
            let card = allCards[i];
            let cCat = card.getAttribute('data-category');
            let cFarmer = card.getAttribute('data-farmer');
            let cPrice = parseFloat(card.getAttribute('data-price'));

            let show = true;

            if (currentFilters.category !== 'all' && cCat !== currentFilters.category) show = false;
            if (currentFilters.farmer !== 'all' && cFarmer !== currentFilters.farmer) show = false;

            if (currentFilters.price !== 'all') {
                if (currentFilters.price === 'low') { minPrice = 0; maxPrice = 2; }
                else if (currentFilters.price === 'medium') { minPrice = 2; maxPrice = 3.5; }
                else if (currentFilters.price === 'high') { minPrice = 3.5; maxPrice = 999999; }

                if (cPrice < minPrice || cPrice >= maxPrice) {
                    show = false;
                }
            }

            if (show) {
                visibleCards.push(card);
            }
        }

        visibleCards.sort(function(a, b) {
            let priceA = parseFloat(a.getAttribute('data-price'));
            let priceB = parseFloat(b.getAttribute('data-price'));
            let idA = parseInt(a.getAttribute('data-id'));
            let idB = parseInt(b.getAttribute('data-id'));
            let scoreA = parseInt(a.getAttribute('data-sort-score'));
            let scoreB = parseInt(b.getAttribute('data-sort-score'));

            if (currentFilters.sort === 'price-asc') return priceA - priceB;
            if (currentFilters.sort === 'price-desc') return priceB - priceA;
            if (currentFilters.sort === 'newest') return idB - idA;
            return scoreB - scoreA;
        });

        allCards.forEach(function(c) {
            c.style.display = 'none';
            c.style.order = '';
        });

        visibleCards.forEach(function(c, index) {
            c.style.display = '';
            c.style.order = index;
        });

        if (visibleCards.length === 0) {
            noResultsBox.style.display = 'block';
        } else {
            noResultsBox.style.display = 'none';
        }

        drawChips();
    }

    function capFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function drawChips() {
        let chipsData = [];

        if (currentFilters.category !== 'all') {
            chipsData.push({ key: 'category', text: capFirstLetter(currentFilters.category.replace('-', ' & ')) });
        }
        if (currentFilters.farmer !== 'all') {
            let parts = currentFilters.farmer.split('-');
            let fName = parts.map(capFirstLetter).join(' ');
            chipsData.push({ key: 'farmer', text: fName });
        }
        if (currentFilters.price !== 'all') {
            chipsData.push({ key: 'price', text: 'Price: ' + capFirstLetter(currentFilters.price) });
        }
        if (currentFilters.sort !== 'popular') {
            let activeSortElement = document.querySelector('.dropdown[data-filter="sort"] .dropdown-opt.is-active');
            let sortTxt = activeSortElement ? activeSortElement.textContent.trim() : '';
            chipsData.push({ key: 'sort', text: sortTxt });
        }

        if (chipsData.length === 0) {
            activeFiltersBox.style.display = 'none';
            return;
        }

        activeFiltersBox.style.display = 'flex';

        let htmlString = '';
        chipsData.forEach(function(c) {
            htmlString += `<span class="filter-chip" data-key="${c.key}">${c.text} <span class="chip-remove">&#215;</span></span>`;
        });
        htmlString += `<button class="chip-clear-all">Clear all</button>`;

        activeFiltersBox.innerHTML = htmlString;

        let crossBtns = activeFiltersBox.querySelectorAll('.chip-remove');
        crossBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                let parentChip = btn.parentElement;
                let k = parentChip.getAttribute('data-key');

                if (k === 'sort') {
                    currentFilters[k] = 'popular';
                } else {
                    currentFilters[k] = 'all';
                }

                resetFilterVisuals(k);
                runFilters();
            });
        });

        let clearAllDOM = activeFiltersBox.querySelector('.chip-clear-all');
        if (clearAllDOM) {
            clearAllDOM.addEventListener('click', function(e) {
                e.stopPropagation();
                doClearAll();
            });
        }
    }

    let defaultLabels = { category: 'Category', farmer: 'Farmer', sort: 'Sort by' };

    function resetFilterVisuals(key) {
        if (key === 'price') {
            document.querySelectorAll('.price-seg').forEach(function(b) {
                b.classList.remove('is-active');
            });
            document.querySelector('.price-seg[data-value="all"]').classList.add('is-active');
            return;
        }
        let item = document.querySelector(`.filter-item[data-filter="${key}"]`);
        if (!item) return;

        item.querySelectorAll('.dropdown-opt').forEach(function(o) {
            o.classList.remove('is-active');
        });
        let allOption = item.querySelector('.dropdown-opt[data-value="all"]');
        if (allOption) allOption.classList.add('is-active');

        let labelDOM = item.querySelector('.filter-label');
        if (labelDOM) {
            labelDOM.textContent = defaultLabels[key] || capFirstLetter(key);
        }
    }

    function doClearAll() {
        let keys = Object.keys(currentFilters);
        keys.forEach(function(k) {
            currentFilters[k] = (k === 'sort') ? 'popular' : 'all';
        });

        let allDropdowns = document.querySelectorAll('.filter-item[data-filter]');
        allDropdowns.forEach(function(item) {
            let k = item.getAttribute('data-filter');
            resetFilterVisuals(k);
        });
        runFilters();
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', doClearAll);
    }





    let mainGrid = document.getElementById('grid');

    let animSpeeds = { bg: 220, w: 380, h: 340, text: 240, close: 300 };
    let easeFunc = 'cubic-bezier(0.4, 0, 0.2, 1)';
    let mobileSize = 580;

    let openedCardState = null;

    function getColumnsNum() {
        let gridStyle = window.getComputedStyle(mainGrid).gridTemplateColumns;
        return gridStyle.trim().split(/\s+/).filter(function(s) { return s !== ''; }).length;
    }

    function getGridGap() {
        let gapValue = parseFloat(window.getComputedStyle(mainGrid).columnGap);
        if (isNaN(gapValue)) return 32;
        return gapValue;
    }

    function getRelativePos(element) {
        let parentRect = mainGrid.getBoundingClientRect();
        let elRect = element.getBoundingClientRect();
        return {
            top: elRect.top - parentRect.top,
            left: elRect.left - parentRect.left,
            width: elRect.width,
            height: elRect.height
        };
    }


    function delay(ms) {
        return new Promise(function(res) {
            setTimeout(res, ms);
        });
    }

    function animateCSS(elem, properties, time) {
        return new Promise(function(resolve) {
            elem.getBoundingClientRect();

            let transitions = [];
            let keys = Object.keys(properties);
            for(let i = 0; i < keys.length; i++) {

                let cssName = keys[i].replace(/([A-Z])/g, function(m) {
                    return '-' + m.toLowerCase();
                });
                transitions.push(`${cssName} ${time}ms ${easeFunc}`);
            }

            elem.style.transition = transitions.join(', ');

            requestAnimationFrame(function() {
                Object.assign(elem.style, properties);
                setTimeout(resolve, time);
            });
        });
    }


    let darkBg = document.createElement('div');
    darkBg.className = 'card-backdrop';
    document.body.appendChild(darkBg);
    darkBg.addEventListener('click', function() { closeCard(); });

    async function openCard(cardElem) {
        if (openedCardState) {
            await closeCard(true);
        }

        if (window.innerWidth <= mobileSize) {
            await doMobileSheet(cardElem);
        } else {
            await doDesktopOverlay(cardElem);
        }
    }

    async function doDesktopOverlay(card) {


        let colCount = getColumnsNum();
        let gapSize = getGridGap();
        let position = getRelativePos(card);

        let gWidth = mainGrid.getBoundingClientRect().width;
        let cWidth = (gWidth - gapSize * (colCount - 1)) / colCount;
        let vCol = Math.round(position.left / (cWidth + gapSize));


        let willOverflow = (position.left + position.width * 2 + gapSize) > gWidth + 4;
        let goLeft = (vCol >= colCount - 1) || willOverflow;

        let targetWidth = position.width * 2 + gapSize;
        let targetHeight = position.height * 2 + gapSize;
        let targetLeftPosition = position.left;

        if (goLeft) {
            targetLeftPosition = position.left - position.width - gapSize;
        }

        let overlayDiv = document.createElement('div');
        overlayDiv.className = 'card-expanded-overlay';
        overlayDiv.setAttribute('data-category', card.getAttribute('data-category'));


        let clone = card.querySelector('.card-inner').cloneNode(true);
        overlayDiv.appendChild(clone);


        let btnBuy = overlayDiv.querySelector('.btn-primary.full-width');
        if (btnBuy) btnBuy.className = 'btn-buy';

        overlayDiv.style.top = position.top + 'px';
        overlayDiv.style.left = position.left + 'px';
        overlayDiv.style.width = position.width + 'px';
        overlayDiv.style.height = position.height + 'px';

        mainGrid.appendChild(overlayDiv);

        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';

        openedCardState = { card: card, overlay: overlayDiv, type: 'overlay' };

        let closeBtn = overlayDiv.querySelector('.details-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeCard();
            });
        }

        setupQuantity(overlayDiv);
        setupTabs(overlayDiv);

        darkBg.style.display = 'block';
        darkBg.getBoundingClientRect();
        darkBg.style.transition = `opacity ${animSpeeds.bg}ms ease`;
        darkBg.style.opacity = '1';

        await delay(animSpeeds.bg);


        await animateCSS(overlayDiv, { width: targetWidth + 'px', left: targetLeftPosition + 'px' }, animSpeeds.w);
        await animateCSS(overlayDiv, { height: targetHeight + 'px' }, animSpeeds.h);

        overlayDiv.classList.add('is-expanded');

        let detailsBlock = overlayDiv.querySelector('.card-details');
        if (detailsBlock) {
            detailsBlock.style.opacity = '0';
            detailsBlock.style.transition = `opacity ${animSpeeds.text}ms ease`;
            requestAnimationFrame(function() {
                detailsBlock.style.opacity = '1';
            });
        }


        overlayDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }


    async function doMobileSheet(card) {
        let detailsHTML = card.querySelector('.card-details');
        let previewHTML = card.querySelector('.card-preview');


        let imgSrc = '';
        if (previewHTML.querySelector('.prod-img img')) {
            imgSrc = previewHTML.querySelector('.prod-img img').src;
        }

        let titleTxt = detailsHTML.querySelector('.details-title') ? detailsHTML.querySelector('.details-title').textContent : '';
        if (!titleTxt && previewHTML.querySelector('.prod-title')) {
            titleTxt = previewHTML.querySelector('.prod-title').textContent;
        }

        let authorTxt = previewHTML.querySelector('.prod-author') ? previewHTML.querySelector('.prod-author').textContent : '';
        let priceTxt = previewHTML.querySelector('.prod-price') ? previewHTML.querySelector('.prod-price').textContent : '';
        let descTxt = detailsHTML.querySelector('.details-desc') ? detailsHTML.querySelector('.details-desc').textContent : '';

        let tagsBlock = detailsHTML.querySelector('.details-tags');
        let metaBlock = detailsHTML.querySelector('.details-meta');
        let nutBlock = detailsHTML.querySelector('.details-nutrition');
        let infoBlock = detailsHTML.querySelector('.details-info-grid');
        let recipeBlock = detailsHTML.querySelector('.details-recipe');
        let seasonBlock = detailsHTML.querySelector('.details-season');

        let qtyVal = '1 unit';
        if (detailsHTML.querySelector('.qty-selector span')) {
            qtyVal = detailsHTML.querySelector('.qty-selector span').textContent;
        }

        let myTagsHTML = tagsBlock ? tagsBlock.innerHTML : '';

        let myMetaHTML = '';
        if (metaBlock) {
            let items = metaBlock.querySelectorAll('.meta-item');
            items.forEach(function(m) {
                let s = m.querySelector('strong') ? m.querySelector('strong').textContent : '';
                let v = m.textContent.replace(s, '').trim();
                myMetaHTML += `<div class="meta-item"><strong>${s}</strong>${v}</div>`;
            });
        }

        let myNutHTML = '';
        if (nutBlock) {
            let lbl = nutBlock.querySelector('.nutrition-label') ? nutBlock.querySelector('.nutrition-label').textContent : '';
            let nItems = nutBlock.querySelectorAll('.nut-item');
            let nHTML = '';
            nItems.forEach(function(n) {
                let val = n.querySelector('.nut-val') ? n.querySelector('.nut-val').textContent : '';
                let t = n.querySelector('.nut-lbl') ? n.querySelector('.nut-lbl').textContent : '';
                nHTML += `<div class="nut-item"><span class="nut-val">${val}</span><span class="nut-lbl">${t}</span></div>`;
            });
            myNutHTML = `<div class="sheet-nutrition"><p class="nutrition-label">${lbl}</p><div class="nutrition-row">${nHTML}</div></div>`;
        }

        let myInfoHTML = infoBlock ? infoBlock.outerHTML.replace('details-info-grid', 'sheet-info-grid') : '';
        let myRecipeHTML = recipeBlock ? recipeBlock.outerHTML : '';
        let mySeasonHTML = seasonBlock ? seasonBlock.outerHTML : '';


        let sheetDiv = document.createElement('div');
        sheetDiv.className = 'card-bottom-sheet';
        sheetDiv.style.height = '55vh';

        let insideHTML = `
            <div class="sheet-handle"></div>
            <div class="sheet-body">
                <div class="sheet-hero">
                    <div class="sheet-img"><img src="${imgSrc}" alt=""></div>
                    <div class="sheet-title-block">
                        <h3 class="prod-title">${titleTxt}</h3>
                        <p class="prod-author">${authorTxt}</p>
                        <div class="prod-price">${priceTxt}</div>
                    </div>
                </div>`;

        if (myTagsHTML) insideHTML += `<div class="sheet-tags">${myTagsHTML}</div>`;
        if (descTxt) insideHTML += `<p class="sheet-desc">${descTxt}</p>`;
        if (myMetaHTML) insideHTML += `<div class="sheet-meta">${myMetaHTML}</div>`;
        insideHTML += myNutHTML + myInfoHTML + myRecipeHTML + mySeasonHTML;
        insideHTML += `</div>
            <div class="sheet-actions">
                <div class="qty-selector">
                    <button class="qty-minus">-</button>
                    <span>${qtyVal}</span>
                    <button class="qty-plus">+</button>
                </div>
                <button class="btn-buy">ADD TO CART</button>
            </div>
        `;

        sheetDiv.innerHTML = insideHTML;
        document.body.appendChild(sheetDiv);

        setupQuantity(sheetDiv);

        openedCardState = { card: card, sheet: sheetDiv, type: 'sheet' };

        darkBg.style.display = 'block';
        darkBg.getBoundingClientRect();
        darkBg.style.transition = `opacity ${animSpeeds.bg}ms ease`;
        darkBg.style.opacity = '1';

        await delay(20);
        sheetDiv.classList.add('is-open');


        let handleArea = sheetDiv.querySelector('.sheet-handle');
        let bodyArea = sheetDiv.querySelector('.sheet-body');
        bodyArea.style.overflowY = 'hidden';

        let startY = 0;
        let startHeight = 0;
        let dragging = false;

        function setSnap(percent, doAnim) {
            if (doAnim) {
                sheetDiv.style.transition = `transform 0.42s ${easeFunc}, height 0.32s ${easeFunc}`;
            } else {
                sheetDiv.style.transition = 'none';
            }
            sheetDiv.style.height = percent + 'vh';
            if (percent === 88) {
                bodyArea.style.overflowY = 'auto';
            } else {
                bodyArea.style.overflowY = 'hidden';
            }
        }

        handleArea.addEventListener('pointerdown', function(e) {
            startY = e.clientY;
            startHeight = sheetDiv.getBoundingClientRect().height;
            dragging = true;
            sheetDiv.style.transition = 'none';
            handleArea.setPointerCapture(e.pointerId);
        });

        handleArea.addEventListener('pointermove', function(e) {
            if (!dragging) return;
            let diffY = startY - e.clientY;

            let calcHeight = startHeight + diffY;
            if (calcHeight < window.innerHeight * 0.2) calcHeight = window.innerHeight * 0.2;
            if (calcHeight > window.innerHeight * 0.88) calcHeight = window.innerHeight * 0.88;

            sheetDiv.style.height = calcHeight + 'px';
        });

        handleArea.addEventListener('pointerup', function() {
            if (!dragging) return;
            dragging = false;
            let currentPct = (sheetDiv.getBoundingClientRect().height / window.innerHeight) * 100;

            if (currentPct < 25) {
                closeCard();
            } else if (currentPct < (55 + 88) / 2) {
                setSnap(55, true);
            } else {
                setSnap(88, true);
            }
        });

        handleArea.addEventListener('pointercancel', function() {
            dragging = false;
        });
    }


    function setupTabs(box) {
        let tButtons = box.querySelectorAll('.dtab');
        let tPanels = box.querySelectorAll('.dtab-panel');

        tButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                let targetId = btn.getAttribute('data-tab');

                tButtons.forEach(function(b) { b.classList.remove('is-active'); });
                tPanels.forEach(function(p) { p.classList.remove('is-active'); });

                btn.classList.add('is-active');
                let targetPanel = box.querySelector(`.dtab-panel[data-panel="${targetId}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('is-active');
                }
            });
        });
    }


    function setupQuantity(box) {
        let btnMin = box.querySelector('.qty-minus');
        let btnPls = box.querySelector('.qty-plus');
        let textSpan = box.querySelector('.qty-selector span');

        if (!btnMin || !btnPls || !textSpan) {

            btnMin = box.querySelector('.qty-selector button:first-child');
            btnPls = box.querySelector('.qty-selector button:last-child');
        }

        if (!btnMin || !btnPls || !textSpan) return;


        let regex = /[a-zA-Z\/\u00C0-\u024F]+.*$/;
        let match = textSpan.textContent.match(regex);
        let unitText = match ? match[0].trim() : '';

        let currentNum = parseFloat(textSpan.textContent);
        if (isNaN(currentNum)) currentNum = 1;

        btnMin.addEventListener('click', function(e) {
            e.stopPropagation();
            currentNum--;
            if (currentNum < 1) currentNum = 1;
            textSpan.textContent = `${currentNum} ${unitText}`;
        });

        btnPls.addEventListener('click', function(e) {
            e.stopPropagation();
            currentNum++;
            textSpan.textContent = `${currentNum} ${unitText}`;
        });
    }

    async function closeCard(noAnimation) {
        if (!openedCardState) return;

        let card = openedCardState.card;
        let overlayElem = openedCardState.overlay;
        let sheetElem = openedCardState.sheet;
        let type = openedCardState.type;

        openedCardState = null;

        if (noAnimation) {
            darkBg.style.transition = 'none';
        } else {
            darkBg.style.transition = `opacity ${animSpeeds.close}ms ease`;
        }
        darkBg.style.opacity = '0';

        if (type === 'sheet') {
            if (sheetElem) {
                if (!noAnimation) {
                    sheetElem.classList.remove('is-open');
                    await delay(440);
                }
                sheetElem.remove();
            }
        } else if (overlayElem) {
            if (noAnimation) {
                overlayElem.remove();
            } else {
                let detBox = overlayElem.querySelector('.card-details');
                if (detBox) detBox.style.opacity = '0';

                overlayElem.classList.remove('is-expanded');

                let origPos = getRelativePos(card);

                await animateCSS(overlayElem, {
                    width: origPos.width + 'px',
                    height: origPos.height + 'px',
                    left: origPos.left + 'px',
                    opacity: '0'
                }, animSpeeds.close);

                overlayElem.remove();
            }
        }

        await delay(50);
        darkBg.style.display = 'none';

        if (card) {
            card.style.visibility = '';
            card.style.pointerEvents = '';
        }
    }

    mainGrid.addEventListener('click', function(e) {
        let clickedCard = e.target.closest('.product-card');
        if (!clickedCard) return;

        if (e.target.classList.contains('btn-add')) return;

        if (openedCardState && openedCardState.card === clickedCard) return;

        openCard(clickedCard);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCard();
        }
    });

});

function setupCountdown() {
    let timerElement = document.getElementById('countdownTimer');
    if (!timerElement) return;

    function updateTime() {
        let now = new Date();
        let cutoff = new Date(now);
        cutoff.setHours(10, 0, 0, 0);

        if (now >= cutoff) {
            cutoff.setDate(cutoff.getDate() + 1);
        }

        let diff = cutoff - now;
        let hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
        let mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        let secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

        timerElement.textContent = hours + ':' + mins + ':' + secs;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function setupHeroDate() {
    let dateElement = document.getElementById('heroDate');
    if (!dateElement) return;

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let d = new Date();
    let startOfYear = new Date(d.getFullYear(), 0, 1);
    let weekNumber = Math.ceil((d - startOfYear) / 604800000);

    dateElement.innerHTML = days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' &nbsp;&bull;&nbsp; Vol.5 No.' + weekNumber + ' &nbsp;&bull;&nbsp; 47 Farmers Active';
}

function setupChips() {
    let chipsList = document.querySelectorAll('.cat-chip');
    let categoryDropdown = document.querySelector('.filter-item[data-filter="category"]');

    if (chipsList.length === 0 || !categoryDropdown) return;

    chipsList.forEach(function(chip) {
        chip.addEventListener('click', function() {
            let catValue = chip.getAttribute('data-cat');

            chipsList.forEach(function(c) {
                c.classList.remove('is-active');
            });
            chip.classList.add('is-active');

            let option = categoryDropdown.querySelector('.dropdown-opt[data-value="' + catValue + '"]');
            if (option) {
                option.click();
            }
        });
    });

    let dropOptions = categoryDropdown.querySelectorAll('.dropdown-opt');
    dropOptions.forEach(function(opt) {
        opt.addEventListener('click', function() {
            let val = opt.getAttribute('data-value');
            chipsList.forEach(function(c) {
                if (c.getAttribute('data-cat') === val) {
                    c.classList.add('is-active');
                } else {
                    c.classList.remove('is-active');
                }
            });
        });
    });
}


setupCountdown();
setupHeroDate();
setupChips();