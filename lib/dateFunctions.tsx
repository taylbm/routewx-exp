import { parse } from 'date-fns'

export function parseFrameDate(frameName: string) {
  const parsedDate = parse(
    frameName.split('shsr-')[1],
    'yyyyMMdd-HHmm',
    new Date()
  )
  const zonedDate = subtractHours(
    parsedDate,
    new Date().getTimezoneOffset() / 60
  )
  return zonedDate
}

export function getFrameUrl(frameName: string) {
  return process.env.NEXT_PUBLIC_API_URL + '/services/' + frameName
}

export function subtractHours(objDate: Date, intHours: number) {
  var numberOfMlSeconds = objDate.getTime()
  var addMlSeconds = intHours * 60 * 60 * 1000
  var newDateObj = new Date(numberOfMlSeconds - addMlSeconds)

  return newDateObj
}

export async function getTimes(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_API_URL + '/times?version=2'
  const response = await fetch(url) // get list of available times
  const times = await response.json()
  return times.dateStrings
}

export function getTimezoneName() {
  const today = new Date()
  const short = today.toLocaleDateString(undefined)
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'short' })

  // Trying to remove date from the string in a locale-agnostic way
  const shortIndex = full.indexOf(short)
  if (shortIndex >= 0) {
    const trimmed =
      full.substring(0, shortIndex) + full.substring(shortIndex + short.length)

    // by this time `trimmed` should be the timezone's name with some punctuation -
    // trim it from both sides
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '')
  } else {
    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full
  }
}

export function parseDate(frameName: string) {
  const parsedDate = parse(
    frameName.split('shsr-')[1],
    'yyyyMMdd-HHmm',
    new Date()
  )
  const zonedDate = subtractHours(
    parsedDate,
    new Date().getTimezoneOffset() / 60
  )
  return zonedDate
}
