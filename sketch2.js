let model //모델을 로딩했을때 모델을 보관할 수 있는 오브젝트를 모델이라고 부른다.
let previousPen = "down" //펜의 상태 
//down 일 경우에만 펜을 종이에 붙여서 그림을 그릴 수 있는 것이다. 
let x, y //그림의 위치 x와 y 좌표값
//=======이 세가지가 제일 중요한것
let strokePath //이런것이 담겨있는 것이 strokePath라고 한다.

function preload(){
    /*preload함수는 setup과 draw가 실행되기 전에 제일 먼저 실행되는것이다.
    이게 있는 이유는 보통 외부에서 파일을 부를때 setup과 draw에서 함수를 부르게 된다면 준비가 되어있지 않은 상태에서 사용하려고 하다 에러가 나는 상황이 생긴다. 이런걸 방지하기 위하여 */
    model = ml5.sketchRNN("flower",modelReady)//그리고자하는 객체를 부른다.

   
}
function modelReady(){
    console.log('model is ready.')
}
function setup(){
    createCanvas(600,400)//캔버스 만들어줌.

    background(234)

    x = width/2
    y = height/2
    // 그림을 화면 중앙에서 그리게 시킴

    model.reset()//모델 초기화
    model.generate(gotStroke)//모델이 스토로콜 생성

    
}
function gotStroke(err, result){
    strokePath = result//결과를 받으면 strokePath를 통해 임시로 저장 (이유: 전역 변수가 있어야 다른곳에서 빼서 쓸 수 있으니까.)
    
}
function draw(){
    scale(0.5)
    translate(width/2, height/2)
    if(strokePath){//strokePath가 준비되어있는 경우에만 무언가를 하자.
        if(previousPen == "down")//펜의 상태가 다운인 경우에만 그림을 그리겠다.
        {
            stroke(0) //선의 색
            strokeWeight(8) //선의 굵기
            line(x, y, x + strokePath.dx, y + strokePath.dy)  //기준점x,y에서 x는 x + dx 만큼  y는 y+dy만큼 이동해주면 다음 점을 찾을 수 있는 것이다. 현재 끝점은 다음의 첫번째 시잠점이고 이를 반복하면 선이 만들어 질 것이다. 
        }
        x += strokePath.dx // 바로전에 선이 끝난 부분으로 기준점을 옮김
        y += strokePath.dy
        previousPen = strokePath.pen //pen의 상태를 옮김 

        //모델과 generate를 다시 호출해주어야함. 
        if(strokePath.pen !=="end"){ 
            strokePath = null // end인 경우지만 line이 그려질 확률이 있으므로,
            model.generate(gotStroke)
        }
    }
}
