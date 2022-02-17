import { format, parse } from 'date-fns'

export function formatTick(ms: number) {
  return format(new Date(ms), 'MMM dd h:mm a')
}

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

export async function getTimes() {
  const url = process.env.NEXT_PUBLIC_API_URL + '/times?version=2'
  const response = await fetch(url) // get list of available times
  const times = await response.json()
  return times
}
