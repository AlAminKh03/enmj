const deleteProduct = (btn)=>{
    const productId= btn.parentNode.querySelector("[name=productId]").value
    const csrfToken= btn.parentNode.querySelector("[name=_csrf]").value

    const productElement = btn.closest('article')
    fetch('/admin/product/' + productId,{
        method:"DELETE",
        headers:{
            'csrf-token':csrfToken
        }
    })
    .then(res=>{
        return res.json()
    })
    .then(product=>{
        productElement.parentNode.removeChild(productElement)
    })
    .catch(err=>{
        console.log(err);
    })
}