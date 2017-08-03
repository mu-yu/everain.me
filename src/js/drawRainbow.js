
var canvas = document.getElementsByClassName('index-bg')[0]
var context
var f = 90
var point
var r = 0
var _2PI = Math.PI * 2
var width
var height

function drawRainbow () {
  if (!canvas) return
  context = canvas.getContext('2d')
  context.globalAlpha = 0.6

  width = document.querySelector('.index .tip').offsetWidth
  height = document.querySelector('.index .tip').offsetHeight

  canvas.width = width
  canvas.height = height

  context.clearRect(0, 0, width, height)
  point = [{ x: 0, y: height * 0.7 + f }, { x: 0, y: height * 0.7 - f }]
  while (point[1].x < width + f) drawTriangle(point[0], point[1])
}
function drawTriangle (i, j) {
  context.beginPath()
  context.moveTo(i.x, i.y)
  context.lineTo(j.x, j.y)
  var k = j.x + (Math.random() * 2 - 0.25) * f
  var n = y(j.y)
  context.lineTo(k, n)
  context.closePath()
  r -= _2PI / -50
  context.fillStyle = '#' + (Math.cos(r) * 127 + 128 << 16 | Math.cos(r + _2PI / 3) * 127 + 128 << 8 | Math.cos(r + _2PI / 3 * 2) * 127 + 128).toString(16)
  context.fill()
  point[0] = point[1]
  point[1] = {x: k, y: n}
}
function y (p) {
  var t = p + (Math.random() * 2 - 1.1) * f
  return (t > height || t < 0) ? y(p) : t
}

export default drawRainbow
