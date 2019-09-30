
export function getElementById(id: string) {
  const elem = document.getElementById(id)
  if(!elem) throw Error("Could not find element " + id)
  return elem
}