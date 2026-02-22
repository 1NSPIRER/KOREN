
let dbFarmers = {
    olivia: {
        photo: 'images/farmers/person-1.jpg',
        name: 'Olivia Reynolds',
        overline: 'Lviv Region · 12 ha · Organic Vegetables',
        tagline: 'Farming with the belief that healthy soil is the foundation of everything.',
        stats: [{ val: '12', lbl: 'Years farming' }, { val: '12 ha', lbl: 'Farm size' }, { val: '6', lbl: 'Crops grown' }],
        bio: "Olivia started her farm outside Lviv after 10 years working in food logistics. She saw first-hand how much value was lost between field and fork and decided to build something different. Today her 12-hectare no-till operation supplies over 200 households weekly. She rotates 6 main crops on a 4-year cycle, composts all waste on-site, and has never used a synthetic input.",
        practices: ['Certified Organic', 'No-Till', 'Crop Rotation', 'On-site Composting', 'Rainwater Harvesting', 'Biodiversity Corridors'],
    },
    ethan: {
        photo: 'images/farmers/person-2.jpg',
        name: 'Ethan Carter',
        overline: 'Poltava Region · Open-Field Vegetables',
        tagline: 'If it needs a chemical to survive, it\'s the wrong plant for this field.',
        stats: [{ val: '9', lbl: 'Years farming' }, { val: '8 ha', lbl: 'Farm size' }, { val: '2', lbl: 'Main crops' }],
        bio: "Ethan converted his family's grain farm to a diverse vegetable operation in 2016. He\'d always grown food for the family but a conversation with a Kyiv chef about what was actually available at market changed his mind about scale. He grows lettuce and broccoli in open-field rotation, irrigated only with collected rainwater. His soil tests show improving organic matter year on year.",
        practices: ['No Pesticides', 'Composted Fertiliser Only', 'Open Crate Packaging', 'Rainwater Irrigation', 'Same-Day Harvest'],
    },
    james: {
        photo: 'images/farmers/person-3.jpg',
        name: 'James Whitaker',
        overline: 'Vinnytsia Region · Heritage Orchard · 30 years',
        tagline: 'My grandfather planted these trees. The apples taste like apples used to.',
        stats: [{ val: '30', lbl: 'Years farming' }, { val: '18 ha', lbl: 'Orchard size' }, { val: '3', lbl: 'Fruit varieties' }],
        bio: "James inherited the orchard from his grandfather in 1994. What started as a sideline to the family wheat operation became his whole life. He grafted new Granny Smith stock onto the original rootstock — the trees are now 30+ years old and produce a flavour complexity impossible in younger plantings. Zero spray policy for 12 years. No wax coating, ever. The apples are safe to eat skin-on.",
        practices: ['Heritage Rootstock', 'Zero Spray (12 years)', 'No Wax Coating', 'Hand-Picked', 'Wooden Crate Packaging'],
    },
    noah: {
        photo: 'images/farmers/person-4.jpg',
        name: 'Noah Harrison',
        overline: 'Zhytomyr Region · Pasture Eggs · 4 ha',
        tagline: 'Two hundred hens. Four hectares. No antibiotics since day one.',
        stats: [{ val: '6', lbl: 'Years farming' }, { val: '4 ha', lbl: 'Pasture size' }, { val: '200', lbl: 'Hens' }],
        bio: "Noah came to farming from software engineering. He spent 2 years researching pasture egg models in France and New Zealand before starting his operation in Zhytomyr. The hens are Rhode Island Red × Marans crosses — a breed chosen for welfare temperament and yolk quality. No antibiotics, no synthetic hormones, non-GMO feed only. The deep-orange yolks are a direct result of genuine outdoor access and varied diet.",
        practices: ['Free-Range Pasture', 'No Antibiotics', 'Non-GMO Feed', 'No Hormones', 'Recycled Cardboard Packaging', 'Padded Next-Day Delivery'],
    },
    sophia: {
        photo: 'images/farmers/person-6.jpg',
        name: 'Sophia Mitchell',
        overline: 'Ivano-Frankivsk · Greenhouse Berries · 8 years',
        tagline: 'Brix 11–13. If it doesn\'t hit that sweetness, it doesn\'t ship.',
        stats: [{ val: '8', lbl: 'Years farming' }, { val: '11–13°', lbl: 'Brix score' }, { val: '18', lbl: 'Max baskets/day' }],
        bio: "Sophia studied horticultural science before starting her greenhouse operation in the Carpathian foothills. The high altitude and temperature swings produce naturally high-brix fruit without any sweetening intervention. She uses biological pest control exclusively — beneficial insects rather than sprays. Each basket is 400 g, picked the same morning it ships. She caps orders at 18 baskets per day to maintain freshness guarantees.",
        practices: ['Certified Organic', 'Biological Pest Control', 'Brix Quality Control', 'Compostable Packaging', 'Same-Day Delivery Only', 'Greenhouse Climate Control'],
    }
};

function openFarmerModal(key) {
    let farmer = dbFarmers[key];
    if (!farmer) return;

    let imgElem = document.getElementById('modalPhoto');
    imgElem.src = farmer.photo;
    imgElem.alt = farmer.name;


    let sHtml = '';
    for (let i = 0; i < farmer.stats.length; i++) {
        sHtml += '<div class="f-modal__stat">';
        sHtml += '<span class="f-modal__stat-val">' + farmer.stats[i].val + '</span>';
        sHtml += '<span class="f-modal__stat-lbl">' + farmer.stats[i].lbl + '</span>';
        sHtml += '</div>';
    }


    let pHtml = '';
    for (let i = 0; i < farmer.practices.length; i++) {
        pHtml += '<span class="f-modal__practice">' + farmer.practices[i] + '</span>';
    }

    let container = document.getElementById('modalBody');
    container.innerHTML =
        '<div>' +
        '<div class="f-modal__overline">' + farmer.overline + '</div>' +
        '<h2 class="f-modal__name">' + farmer.name + '</h2>' +
        '</div>' +
        '<p class="f-modal__tagline">' + farmer.tagline + '</p>' +
        '<div class="f-modal__stat-row">' + sHtml + '</div>' +
        '<div>' +
        '<div class="f-modal__section-title">About</div>' +
        '<p class="f-modal__bio">' + farmer.bio + '</p>' +
        '</div>' +
        '<div>' +
        '<div class="f-modal__section-title">Practices</div>' +
        '<div class="f-modal__practices">' + pHtml + '</div>' +
        '</div>' +
        '<a href="marketplace.html">' +
        '<button class="f-modal__btn">Browse ' + farmer.name.split(' ')[0] + '\'s Products &rarr;</button>' +
        '</a>';

    document.getElementById('modalOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
}

function closeModalBg(e) {
    if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
}


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});