//Generated on Thursday, February 21, 2013 18:44:35 by the SCION SCXML compiler





function $expr_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_12_column_53.apply(this, arguments));
}

function $expr_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_9_column_54.apply(this, arguments));
}

function $expr_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_15_column_53.apply(this, arguments));
}

function $expr_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_20_column_53.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "AB",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "A"
                        }
                    ]
                },
                {
                    "id": "A",
                    "onEntry": $log_line_9_column_54,
                    "onExit": $log_line_12_column_53,
                    "transitions": [
                        {
                            "target": "B",
                            "event": "e1",
                            "onTransition": $log_line_15_column_53
                        }
                    ]
                },
                {
                    "id": "B",
                    "transitions": [
                        {
                            "target": "A",
                            "event": "e2",
                            "onTransition": $log_line_20_column_53
                        }
                    ]
                }
            ]
        }
    ]
};