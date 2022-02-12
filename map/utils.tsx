import { format, subHours, parse } from 'date-fns'

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
  const uri = 'https://api.routewx.com'
  return uri + '/services/' + frameName
}

export function subtractHours(objDate: Date, intHours: number) {
  var numberOfMlSeconds = objDate.getTime()
  var addMlSeconds = intHours * 60 * 60 * 1000
  var newDateObj = new Date(numberOfMlSeconds - addMlSeconds)

  return newDateObj
}
