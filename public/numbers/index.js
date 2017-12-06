add = (x, y) => x + y
sub = (x, y) => x - y
mult = (x, y) => x * y
div = (x, y) => x / y

add.to_string = () => '+'
sub.to_string = () => '-'
mult.to_string = () => '*'
div.to_string = () => '/'

value = n => {
    if(typeof n === 'number')
        return n
    else return n.op(value(n.x),value(n.y))
}

play = (values, n) => {
    if(values.length === 1 && value(values[0]) == n){
        return values[0]
    }

    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values.length; j++) {
            if (i === j) continue
            let rest = values.filter((item, index) => index != i && index != j)
            let result = (
            play([{op: add, x: values[i], y: values[j]}, ...rest], n) ||
            play([{op: sub, x: values[i], y: values[j]}, ...rest], n) ||
            play([{op: mult, x: values[i], y: values[j]}, ...rest], n) ||
            play([{op: div, x: values[i], y: values[j]}, ...rest], n)
            )
            
            if(result){
                return result
            }
        }
    }
}

to_string = exp => {
    if(typeof exp === "number")
        return exp
    else
        return '(' + to_string(exp.x) + exp.op.to_string() + to_string(exp.y) + ')'
}

onChange = () => {
    answer = document.getElementById("answer")
    result = play([
        parseInt(document.getElementById("n1").value) || 0,
        parseInt(document.getElementById("n2").value) || 0,
        parseInt(document.getElementById("n3").value) || 0,
        parseInt(document.getElementById("n4").value) || 0
    ], parseInt(document.getElementById("result").value) || 0)
    if(result) answer.innerHTML = to_string(result)
    else answer.innerHTML = "no result"
}