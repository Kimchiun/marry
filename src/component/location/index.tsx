import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

/**
 * 오시는 길 정보를 표시하는 컴포넌트입니다.
 * 지도와 대중교통, 자가용 이용 방법을 안내합니다.
 *
 * @returns {JSX.Element} 오시는 길 섹션
 */
export const Location = () => {
  return (
    <>
      {/* 지도 및 주소 섹션 */}
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>

      {/* 대중교통 및 자가용 안내 섹션 */}
      <LazyDiv className="card location">
        {/* 대중교통 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * 지하철 이용시
            <br />
            지하철 1·2호선 <b>신도림역 3번출구</b>
            <br />
            → 테크노마트 판매동 지하 1층과 직접 연결
            <br />
            → 엘리베이터 이용, <b>8층 아모르홀</b>
          </div>
          <div />
          <div className="content">
            * 버스 이용 시
            <br />
            <b>신도림역(17-102)</b> 정류장 하차 (3번출구 쪽)
            <br />
            - 지선: 5619, 6411, 6511, 6611
            <br />
            - 직행: 5200
            <br />
            - 마을: 영등포09, 영등포12, 영등포13
            <br />
            <br />
            <b>신도림역(17-001)</b> 정류장 하차 (1번출구 쪽)
            <br />
            → 지하보도 이용 후 테크노마트 판매동 지하 1층 통로 이용
          </div>
        </div>

        {/* 자가용 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            <b>웨딩시티 신도림 아모르홀</b> 검색
            <br />
            - 신도림 테크노마트 지하주차장(B3~B7) 이용
            <br />
            - 예식장 주차 확인 후 3시간 무료 주차
          </div>
        </div>
      </LazyDiv>
    </>
  )
}
