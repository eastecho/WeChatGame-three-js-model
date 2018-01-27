import * as THREE from 'libs/three.min'
require('libs/OrbitControls')

// 此处可以改为您的 json 文件地址
const model = "https://indienova.com/farm/files/indienova-logo.json"

let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })

let scene
let renderer
let camera
let controls
let mesh = undefined

let preLoadDone  = false;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 初始化
    scene    = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ context: ctx, canvas:canvas })

    const winWidth     = window.innerWidth
    const winHeight    = window.innerHeight
    const cameraAspect = winWidth / winHeight

    renderer.setSize(winWidth, winHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    console.log("屏幕尺寸: " + winWidth + " x " + winHeight)

    camera = new THREE.PerspectiveCamera(75, cameraAspect, 10, 100000)
    camera.position.z = 1000

    // 模型载入处理
    let modelLoader = new THREE.JSONLoader()
    modelLoader.load(model,
      function(geometry, materials){
        mesh = new THREE.Mesh(geometry, materials[0])
        mesh.scale.set(1000, 1000, 1000)
        mesh.rotation.x = 1.5
        scene.add(mesh)
        console.log('模型载入完成')

        /* 允许渲染模型 */
        preLoadDone = true
      },
      // onProgress callback
      function (xhr) {
        console.log( (xhr.loaded / xhr.total * 100) + '% 已载入' )
      },
      // onError callback
      function(err) {
        console.log('载入出错', err.target.status)
      }
    );

    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    // 添加投射光
    var directionalLight = new THREE.DirectionalLight(0xcccccc);
    directionalLight.position.set(0, 1200, 1000).normalize();
    scene.add(directionalLight);

    // 添加手势控制
    controls = new THREE.OrbitControls(camera);

    this.loop()
  }

  /**
   * 逻辑更新主函数
   */
  update() {
    // 更新代码
    if (preLoadDone) {
    }
  }

  /**
   * canvas 重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    if (preLoadDone) {
      if (mesh != undefined)
        mesh.rotation.z += 0.001
      renderer.render(scene, camera)
    }
  }

  // 实现帧循环
  loop() {
    this.update()
    this.render()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
