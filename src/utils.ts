
export function getElementById<T=HTMLElement>(id: string): T {
  const elem = document.getElementById(id)
  if(!elem) throw Error("Could not find element " + id)
  return elem as any as T
}