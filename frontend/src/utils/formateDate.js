export function formDate(timestamp){
    const data=new Date(parseInt(timestamp));

    const options={day:"2-digit",month:"short",year:"numeric"};
    return data.toLocaleDateString("en-US",options);
}