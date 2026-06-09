import { useEffect, useRef } from "react"

// 나뭇잎 이동 및 회전 속도 설정 (좀 더 발랄하게 속도 향상)
const X_SPEED = 0.4
const X_SPEED_VARIANCE = 0.5

const Y_SPEED = 0.7
const Y_SPEED_VARIANCE = 0.6

const FLIP_SPEED_VARIANCE = 0.04

/**
 * 개별 나뭇잎 객체를 관리하는 클래스입니다. (이미지 프리로드 없이 캔버스 그리기)
 */
class Leaf {
  x: number
  y: number
  w: number = 0
  h: number = 0
  opacity: number = 0
  flip: number = 0
  xSpeed: number = 0
  ySpeed: number = 0
  flipSpeed: number = 0
  angle: number = 0
  wobbleSpeed: number = 0
  color: string = ""

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    // 초기 위치 무작위 설정
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height * 2 - canvas.height

    this.initialize()
  }

  /**
   * 나뭇잎의 크기, 투명도, 속도 등을 무작위로 초기화합니다.
   */
  initialize() {
    this.w = 12 + Math.random() * 8
    this.h = 8 + Math.random() * 6
    this.opacity = 0.2 + Math.random() * 0.45
    this.flip = Math.random() * Math.PI * 2
    this.angle = Math.random() * Math.PI * 2

    this.xSpeed = X_SPEED + Math.random() * X_SPEED_VARIANCE
    this.ySpeed = Y_SPEED + Math.random() * Y_SPEED_VARIANCE
    this.flipSpeed = (Math.random() - 0.5) * FLIP_SPEED_VARIANCE
    this.wobbleSpeed = 0.015 + Math.random() * 0.025

    // 연핑크 톤에 어울리는 나뭇잎 색상 배열
    const colors = [
      "rgba(255, 182, 193,",  // 라이트 핑크
      "rgba(232, 160, 180,",  // 소프트 로즈
      "rgba(245, 200, 212,",  // 파스텔 핑크
      "rgba(220, 140, 165,",  // 더스티 핑크
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * 화면에 나뭇잎을 직접 그립니다.
   */
  draw() {
    // 화면 밖으로 완전히 벗어났을 경우 상단에서 재배치
    if (this.y > this.canvas.height || this.x > this.canvas.width || this.x < -50) {
      this.initialize()
      this.x = Math.random() * this.canvas.width
      this.y = -20
    }

    this.ctx.save()
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.angle)
    // 플립(회전) 효과 시뮬레이션
    this.ctx.scale(Math.abs(Math.sin(this.flip)), 1)
    this.ctx.globalAlpha = this.opacity

    // 나뭇잎 형태 그리기 (Quadratic Curve 사용)
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color + " 1)"
    this.ctx.moveTo(0, 0)
    this.ctx.quadraticCurveTo(this.w / 2, -this.h, this.w, 0)
    this.ctx.quadraticCurveTo(this.w / 2, this.h, 0, 0)
    this.ctx.closePath()
    this.ctx.fill()

    // 입맥과 짧은 가지선 추가
    this.ctx.beginPath()
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    this.ctx.lineWidth = 1
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(this.w, 0)
    this.ctx.stroke()

    this.ctx.restore()
  }

  /**
   * 나뭇잎의 위치를 업데이트하고 다시 그립니다.
   */
  animate() {
    this.x += this.xSpeed + Math.sin(this.angle) * 0.1
    this.y += this.ySpeed
    this.flip += this.flipSpeed
    this.angle += this.wobbleSpeed
    this.draw()
  }
}

/**
 * 배경에 나뭇잎이 내리는 애니메이션 효과를 주는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 배경 효과 컴포넌트
 */
export const BGEffect = () => {
  const ref = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const leavesRef = useRef<Leaf[]>([])
  const resizeTimeoutRef = useRef(0)
  const animationFrameIdRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    /**
     * 화면 크기에 따른 적절한 나뭇잎 개수를 계산합니다.
     */
    const getLeafNum = () => {
      return Math.min(Math.floor((window.innerWidth * window.innerHeight) / 25000), 50)
    }

    /**
     * 나뭇잎들을 생성하고 초기화합니다.
     */
    const initializeLeaves = () => {
      const count = getLeafNum()
      const leaves = []
      for (let i = 0; i < count; i++) {
        leaves.push(new Leaf(canvas, ctx))
      }
      leavesRef.current = leaves
    }

    initializeLeaves()

    /**
     * 매 프레임마다 나뭇잎을 렌더링합니다.
     */
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      leavesRef.current.forEach((leaf) => leaf.animate())
      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    /**
     * 화면 크기 변경 시 캔버스 크기를 조정하고 나뭇잎 개수를 조절합니다.
     */
    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = window.setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const newLeafNum = getLeafNum()
        if (newLeafNum > leavesRef.current.length) {
          for (let i = leavesRef.current.length; i < newLeafNum; i++) {
            leavesRef.current.push(new Leaf(canvas, ctx))
          }
        } else if (newLeafNum < leavesRef.current.length) {
          leavesRef.current.splice(newLeafNum)
        }
      }, 100)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(animationFrameIdRef.current)
    }
  }, [])

  return (
    <div className="bg-effect">
      <canvas ref={ref} />
    </div>
  )
}
