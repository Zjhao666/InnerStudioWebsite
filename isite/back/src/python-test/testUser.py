


def uploadHeadimg():
    # ! not work: no file boundary founded
    url = base + '/profile/uploadHeadimg?user=1'
    headers = {
        'Content-Type': 'multipart/form-data'
    }
    with open('/home/luncert/Pictures/Wallpapers/body_backimg.png', 'rb') as f:
        data = f.read()
    rep = post(url, headers = headers, data = data)
    print(rep.text)
