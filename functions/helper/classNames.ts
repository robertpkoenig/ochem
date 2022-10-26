function classNames(...classes: String[]) {
  return classes.filter(Boolean).join(" ");
}

export default classNames;
