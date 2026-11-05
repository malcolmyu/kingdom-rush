"""Reproduce the desktop-common book face, without calling it an APK asset."""
import hashlib,json,pathlib,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
name='Sun Yun He Xuan Li Ti.ttf'
source={'file':name,'family':'OriginsBook','role':'h_book','sourceKind':'desktop-common-frontiers','commit':'cf90f0d68002491e705505fdeec346c0e803a97a','sha256':'acc34e16c33622333c93041484b91f0443211fce0af40cdc130c5eeebb42fa25','url':'https://raw.githubusercontent.com/dima201010ia-ui/Kingdom-rush-frontiers-open-s0urce/cf90f0d68002491e705505fdeec346c0e803a97a/_assets/all-desktop/fonts/Sun%20Yun%20He%20Xuan%20Li%20Ti.ttf'}
target=ROOT/'web/assets/fonts'/name
data=target.read_bytes() if target.exists() else urllib.request.urlopen(source['url'],timeout=60).read()
if hashlib.sha256(data).hexdigest()!=source['sha256']:raise RuntimeError('Desktop book font checksum mismatch')
target.write_bytes(data)
(target.parent/'book-source.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
print('Verified desktop-common book face; separate from APK provenance')
