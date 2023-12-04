
const API_KEY = 'gwPJ1caaVMawpqTElNnvyCGTm%2FHVjczmbWF%2FqpMDcf1lXT6zDz5TO32ZAhl4w6jyg11nsUte%2FAGWyyLNnKMZ9w%3D%3D'

async function getData() {
    //url을 먼저 선언하는 이유 : 백엔드에 데이터를 요청할 때 url을 통해 요청할 수 있다.
    //API를 사용할 때 필수로 데려와야할 변수들이 있다(API에서 미리 다 정해놓음)
    const url =`http://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle?ServiceKey=${API_KEY}&searchYearCd=2015&siDo=11&guGun=680&type=json&numOfRows=10&pageNo=1`

    //API 호출하는 방법....
    const response = await fetch(url)

    //아쒸 이게 무슨 말이야?ㅠㅠ
    //await : url 호출을 조금은 기다려 줘야한다(데이터 양에 따라 빨리 올수도 늦게 올수도 있으니까)는 의미로
    //await라는 말을 쓴 것, await 함수를 쓰려면 getData() 함수를 async 선언을 꼭 해줘야한다
    //url을 호출하여 데이터를 받았어 그 데이터를 response라는 변수에 넣어준 상태!!

    const data = await response.json()
    //우리가 url을 호출하여 받아온 데이터 'response'중에 json만 추려서 data라는 변수에 넣겠다는 뜻
    //const response = await fetch(url)
    //const data = await response.json()
    //이 두 줄이 api를 부르는 가~~장 기본적인 명령어다!! 외워주면 좋아요~

    //api가 잘 호출되었는지 console.log에 찍어볼거임
    console.log("data",data);
    const locations = data.items.item.map((spot)=>[
        spot.spot_nm,
        spot.la_crd,
        spot.lo_crd,
    ]);

    //console.log("locations",locations);
    drawMap(locations);
}

//여기서 끝이 아님
//getData함수를 불러와서 언급해줘야 찐 실행이 되겠져? -> getData(); 꼭 말미에 써줘야함

//받은 데이터를 경도,위도에 따른 구글지도 마크업을 찍어줄 drawMap() 함수를 만들어준다. 구글링해도 나옴

function drawMap(locations) {
    //매개변수의 형태 : locations
    // locations = [ ["지역이름",위도,경도], ["지역이름",위도,경도] ]

    const map = new google.maps.Map(document.getElementById("map"),{
        zoom: 13,
        center: new google.maps.LatLng(locations[0][1],locations[0][2]),
        mapTypeId: google.maps.MapTypeId.ROADMAP,

    });

    const infowindow = new google.maps.InfoWindow();

    let marker, i;

    //로케이션별로 마크(지도에 점 찍기) 생성해주기
    for(i = 0; i< locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map : map,
        });

        //마크를 클릭했을 때 보여주는 정보
        google.maps.event.addListener(
            marker,
            "click",
            (function (marker,i){
                return function () {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map,marker);
                };
            }) (marker,i)
        );

    }

}
getData();