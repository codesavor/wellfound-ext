function findElementWithClass(tag, classes, el = document) {
  const elements = el.querySelectorAll(tag);
  for (let i = 0; i < elements.length; i++) {
    if (classes.every(cls => elements[i].className.indexOf(cls) >= 0)) {
      return elements[i];
    }
  }
}

function getCompaniesAndJobs(companies, from = 0) {
  const companyList = [];

  for (let i = from; i < companies.length; i ++) {
    const c = companies[i];

    const avatar = findElementWithClass('img', ['styles_avatar_', 'styles_square_'], c);
    const nameLink = findElementWithClass('a', ['defaultLink_', 'header_'], c);
    const companyTitle = findElementWithClass('h2', ['name_'], nameLink);
    const sizeEl = c.querySelector('span.__halo_fontSizeMap_size--2xs.__halo_lineHeight_comfortable.__halo_fontWeight_medium.__halo_color_slate--500');
    const listingsEl = c.children[2].children[0];
    const expandBtn = findElementWithClass('button', ['toggleExpand_'], c);

    if (expandBtn) {
      expandBtn.click();
    }

    const ts = new Date().getTime();

    const jobs = [];
    listingsEl.children.forEach(listing => {
      const link = findElementWithClass('a', ['defaultLink_', 'information_'], listing);

      if (!link) {
        return;
      }

      const title = findElementWithClass('span', ['title_'], link);
      const meta = link.querySelector('span.__halo_fontSizeMap_size--sm.__halo_color_slate--900');
      const posted = findElementWithClass('span', ['posted_'], listing);
      const idMatch = link.href.match(/\/jobs\/(\d+)-/);

      if (!title || !idMatch || !meta || !posted) {
        return;
      }

      jobs.push({
        id: idMatch ? idMatch[1] : '',
        link: link.href,
        title: title.textContent,
        meta: meta.textContent,
        posted: posted ? posted.textContent : '',
        scrappedAt: ts,
        thisWeek: posted ? posted.className.indexOf('withinLastWeek_') >= 0 : false
      });
    });

    const matches = avatar.src.match(/photos\.angel\.co\/startups\/i\/(\d+)-/);

    companyList.push({
      id: matches ? matches[1] : avatar.src,
      name: companyTitle.textContent,
      link: nameLink.href,
      size: sizeEl && sizeEl.textContent,
      logo: avatar.src,
      scrappedAt: ts,
      jobs
    });
  }

  chrome.runtime.sendMessage(__extensionId, {
    action: "companies",
    data: companyList
  });
}

(function () {
  let wTimer = null;
  function startWatching() {
    if (wTimer) {
      clearInterval(wTimer);
    }

    let count = 0;

    wTimer = setInterval(() => {
      const companies = document.querySelectorAll('div[data-test="StartupResult"]');
      if (count === 0 && 0 < companies.length) {
        try {
          getCompaniesAndJobs(companies, count);
        } catch (err) {
          console.log(err)
        }
        count = companies.length;
      }
    }, 1000);
  }

  const savedSearchToggle = document.querySelector('[data-test="SavedSearch-DetachedAlertToggle"]');
  savedSearchToggle.parentElement.children[2].children[0].click();
  setTimeout(() => {
    const newestEl = document.querySelector('.tippy-tooltip li:nth-child(2) button');

    if (newestEl) {
      newestEl.click();

      setTimeout(() => {
        startWatching();
      });
    }
  }, 1000);

  setTimeout(() => {
    location.reload();
  }, 600000);
})();
