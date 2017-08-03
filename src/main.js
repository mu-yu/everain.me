import drawRainbow from './js/drawRainbow'
import 'font-awesome/css/font-awesome.min.css'
import './stye.css'

// index

function highlightCurrentNav () {
  let curNavClass = location.pathname.substr(1).split('.')[0]
  if (['friend', 'about'].includes(curNavClass)) {
    document.getElementsByClassName(curNavClass)[0].classList.add('active')
  }
}

function windowLoad () {
  highlightCurrentNav()
  drawRainbow()
}

window.addEventListener('load', windowLoad, false)
document.onclick = () => {
  drawRainbow()
}

if (module.hot) {
  module.hot.accept()
}
