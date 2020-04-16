function containAll(job, filter) {
  const { field, params } = filter;
  const list = params.split(",").map(s => s.trim().toLowerCase());
  const val = job[field] ? job[field].toLowerCase() : "";
  return list.every(item => {
    return val.indexOf(item) >= 0;
  });
}

function containNone(job, filter) {
  const { field, params } = filter;
  const list = params.split(",").map(s => s.trim().toLowerCase());
  const val = job[field] ? job[field].toLowerCase() : "";
  return list.every(item => {
    return val.indexOf(item) < 0;
  });
}

function containAny(job, filter) {
  return !containNone(job, filter);
}

function matchOneOf(job, filter) {
  const { field, params } = filter;
  const list = params.split(",").map(s => s.trim().toLowerCase());
  const val = job[field] ? job[field].toLowerCase() : "";
  const filtered = list.filter(item => val === item);

  return filtered.length > 0;
}

function gt(job, filter) {
  const { field, params } = filter;
  const val = job[field] || 0;
  return parseInt(val) > parseInt(params);
}

function gte(job, filter) {
  const { field, params } = filter;
  const val = job[field] || 0;
  return parseInt(val) >= parseInt(params);
}

function lt(job, filter) {
  const { field, params } = filter;
  const val = job[field] || 0;
  return parseInt(val) < parseInt(params);
}

function lte(job, filter) {
  const { field, params } = filter;
  const val = job[field] || 0;
  return parseInt(val) <= parseInt(params);
}

function booleanValue(job, filter) {
  const { field, params } = filter;
  if (params === true) {
    return !!job[field];
  }

  return !job[field];
}

export function filterBy(job, filter) {
  const { type } = filter;

  switch (type) {
    case "containAll":
      return containAll(job, filter);
    case "containAny":
      return containAny(job, filter);
    case "containNone":
      return containNone(job, filter);
    case "matchOneOf":
      return matchOneOf(job, filter);
    case "gt":
      return gt(job, filter);
    case "gte":
      return gte(job, filter);
    case "lt":
      return lt(job, filter);
    case "lte":
      return lte(job, filter);
    case "and":
      return filter.params.every(childFilter => filterBy(job, childFilter));
    case "boolean":
      return booleanValue(job, filter);
    case "or":
      return !filter.params.every(childFilter => !filterBy(job, childFilter));
    default:
      return false;
  }
}
