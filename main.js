$(document).ready(function () {
    const list = document.querySelector('#list');
    const fullCard = document.querySelector('#fullCard')

    fetch("/data.json")
        .then(res => res.json())
        .then(rawData => {

            const data = rawData;
            let placeholderBC = [];
            let result = [];
            let counter = 0;

            function start() {
                for (let i = 0; i < data.length; i++) {
                    current = data[i];
                    dive(current);
                }
            }

            function dive(current) {
                if (current.children.length) {
                    for (let i = 0; i < current.children.length; i++) {

                        let placeholderObject = {
                            "id": current.id,
                            "company": current.company,
                            "president": current.president,
                            "description": current.description
                        }
                        placeholderBC.push(placeholderObject)
                        dive(current.children[i]);
                        placeholderBC.pop();
                    }
                } else {
                    let tempObj = { ...current }; //This is to make a copy of the array

                    tempObj.breadcrumbs = [...placeholderBC];
                    result.push(tempObj);

                    counter++;
                }
            }
            start();
            let abcResult = _.sortBy(result, function(o){return o.company});
            for (let i = 0; i < abcResult.length; i++) {
                const element = abcResult[i];
                let bc = '';
                let counter = 0;


                for (let j = 0; j < element.breadcrumbs.length; j++) {
                    const e = element.breadcrumbs[j];
                    if (bc === '') {
                        bc = e.company;
                        counter++;
                    } else {
                        if (counter === 5) {
                            bc = bc + "<br>...";
                            break
                        } else {
                            bc = bc + "<br>" + e.company;
                            counter++;
                        }
                    }

                }

                const cardContent = `<div style=" width: 400px; margin: 0 auto;">
    <div style="width: 400px; height: 4em; background-color: lightblue; text-align: center; ">
       <br> ${element.company}
    </div>
    <div style="width: 400px;">
        ${bc}

    </div>
</div>`
                const position = "beforeend";
                const newElm = document.createElement("div");
                newElm.innerHTML = cardContent;
                newElm.onclick = function () {
                    fullCard.innerHTML = `ID: ${element.id}<br>
                    Company: ${element.company}<br>
                    President: ${element.president}<br>
                    Description: ${element.description}`;
                }
                list.appendChild(newElm)

                bc = '';
            }
        });
});





