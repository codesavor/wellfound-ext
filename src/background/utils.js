
export function showNewJobsNotification(count) {
  const opt = {
    type: "basic",
    title: "New jobs",
    iconUrl: "icons/128.png",
    message: `You have ${count} new job(s)`
  };
  chrome.notifications.create(`nn_${new Date().getTime()}`, opt);
}

export function showJobAlertNotification(job) {
  let message;
  let tiermsg;

  if (job.tier) {
    if (job.tier.startsWith('Expert')) {
      tiermsg = 'Expert ($$$)';
    } else if (job.tier.startsWith('Intermediate')) {
      tiermsg = 'Intermediate ($$)';
    } else {
      tiermsg = 'Entry level ($)'
    }
  } else {
    tiermsg = "";
  }

  if (job.type.toLowerCase() === 'hourly') {
    message = `
${job.featured ? 'Featured Job' : ''}
${job.usOnly ? 'US Only' : ''}
${tiermsg}   Hourly
Duration:  ${job.duration}
Limit:  ${job.hoursPerWeek}
    `;
  } else {
    message = `
${job.featured ? 'Featured Job' : ''}
${job.usOnly ? 'US Only' : ''}
${tiermsg}   Fixed
Budget: ${job.budget}
    `
  }

  const opt = {
    type: "basic",
    title: job.title,
    iconUrl: "images/job-alert.png",
    message
  };

  chrome.notifications.create(`ja_${job.id}`, opt);
}

export function _setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text });
}

export function convertFormattedString(str) {
  return str
    .replace(/[$,+\ ]/g, "")
    .replace(/k/i, "000")
    .replace(/m/i, "000000");
}

export function formatNumber(n) {
  var num = +n;
  if (num < 1000) {
    return "$" + num;
  } else if (num < 1000000) {
    return "$" + Math.floor(num / 1000) + "k";
  } else {
    return "$" + Math.floor(num / 1000000) + "m";
  }
}
