import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
} from "../../const"
import { COVER_IMAGE } from "../../images"

/**
 * 초대장의 메인 커버 섹션입니다. (전체 화면 적용)
 * 예식 일시, 신랑/신부 이름, 장소를 풀스크린 배경 사진 위에 표시합니다.
 *
 * @returns {JSX.Element} 커버 섹션
 */
export const Cover = () => {
  return (
    <div className="cover-fullscreen">
      {/* 배경 이미지 및 어두운 그라데이션 오버레이 */}
      <div className="bg-image-container">
        <img src={COVER_IMAGE} className="bg-image" alt="Wedding Cover" />
        <div className="cover-overlay" />
      </div>

      {/* 상단 타이틀 영역 */}
      <div className="cover-header">
        <div className="wedding-date-top">
          <span>{WEDDING_DATE.format("YYYY")}</span>
          <span className="dot">.</span>
          <span>{WEDDING_DATE.format("MM")}</span>
          <span className="dot">.</span>
          <span>{WEDDING_DATE.format("DD")}</span>
        </div>
        <h1 className="wedding-title">THE WEDDING</h1>
      </div>

      {/* 하단 정보 영역 */}
      <div className="cover-footer">
        <div className="names-container">
          <span className="name groom">{GROOM_FULLNAME}</span>
          <span className="and">&</span>
          <span className="name bride">{BRIDE_FULLNAME}</span>
        </div>
        <div className="divider-line" />
        <div className="wedding-meta">
          <div className="date-string">
            {WEDDING_DATE.format("YYYY년 M월 D일 A h시")}
          </div>
          <div className="location-string">{LOCATION}</div>
        </div>
      </div>

      {/* 스크롤 안내 */}
      <div className="scroll-indicator">
        <span className="scroll-text">SCROLL DOWN</span>
        <div className="bounce-arrow">▼</div>
      </div>
    </div>
  )
}
