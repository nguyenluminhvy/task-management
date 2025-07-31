export function zeroOutSeconds (datetime: Date) {
  const date = new Date(datetime)
  date.setSeconds(0)

  return date
}
