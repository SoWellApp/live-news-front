const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
    return img
}

export default preloadImage