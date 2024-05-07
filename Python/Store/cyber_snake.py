## Cyber Snake 2077 - Kojiverse Productions
# Mu only (1.4.2 or latest)
from kandinsky import *
from random import *
from perf import *
from os import *

def hex_to_rgb(hex):
  return (int("0x%s"%hex[1:3]),int("0x%s"%hex[3:5]),int("0x%s"%hex[5:]))

k,fl,fc,dr = keydown,fill_rect,fill_circle,draw_string

SAVEFILE = "cybersnake_save"

themes = {
  "cyber" : {
    "snake" : "#00ff00",
    "apple" : "#ff0000",
    "cursed_apple" : "#c83232",
    "background" : "#160016",
    "first" : "#c83232",
    "sec" : "#00ff33"
  },
  "chrysanthemum" : {   
    "snake" : "#e10657",
    "apple" : "#0000ff",
    "cursed_apple" : "#3232c8",
    "background" : "#2b1040",
    "first" : "#7e008d",
    "sec" : "#cd0043",
  }, 
}

class Data:
  def check_mu()->bool:
    try:
      from micropython import *
      from mu import *
      kbd_intr(KEY_ZERO) 
    except ImportError:
      raise ImportError("\nThis game is expected Mu to be install\n-> https://munumworks.github.io/MU/")
      
  def is_save()->bool:
    return f"{SAVEFILE}.sav" in listdir()

  def save_game(stats:dict)->None:
    with open(f"{SAVEFILE}.sav","w") as f:
      f.write(str(stats))

  def load_game()->dict:
    stats = {
      "bestScore":0,
      "lastScore":0,
      "golds":0,
      "passWall":0,
      "revivals":0,
    }
    if Data.is_save():
      with open(f"{SAVEFILE}.sav","r") as f:
        stats = f.read()
      try:
        return eval(stats)
      except:
        return stats
    else:
      return stats

store = {
  "revivals" : 50,
  "passWall" : 500,
}
        
def start_game()->None:
  Data.check_mu()
  global stats
  stats = Data.load_game()
  logo()
  sleep(3)
  loading()
  start_screen()

def wait_ok(draw:bool=False)->None:
  sleep(0.1)
  a = 255
  b=-1
  while not k(KEY_OK):
    if draw: 
      dr(txt:="-PRESS OK-",(320-len(txt)*10)//2,150,(int(200/255*a),int(50/255*a),int(50/255*a)),theme["background"])
      a+=b*0.5
    if a == 22:
      b = 1
    if a==255:
      b = -1      
    else:
      pass
  sleep(0.1)

def start_screen()->None:
  fill(theme["background"])
  dr(txt:="Cyber Snake 2077",(320-len(txt)*10)//2,30,theme["first"],theme["background"])  
  dr(txt:="- By Mu",100,50,theme["first"],theme["background"],True,True)
  fl(60,100,70,10,theme["snake"])
  fl(150,100,10,10,theme["apple"])
  fl(60,70,10,30,theme["snake"])
  fl(60,70,30,10,theme["snake"])
  fl(90,70,10,20,theme["snake"])
  fl(90,80,200,10,theme["snake"])
  fl(124,104,2,2,"#000000")
  wait_ok(True)
    
def loading()->None:
  fill(theme["background"])
  fill_polygon([(20,95),(35,125),(300,125),(285,95)],theme["sec"])
  fill_polygon([(22,97),(37,125-2),(300-2,125-2),(285-2,95+2)],theme["background"])
  a = 22+15
  b = ""
  while not a>=298:
    a+=randint(1,50)
    b+="."
    if len(b)>3:
      b=""
      fl(0,50,320,20,theme["background"])
    if a>298:a=298  
    dr(txt:=f"Loading {b}",(320-len(txt)*10)//2,50,theme["first"],theme["background"],False,True)
    fill_polygon([(22,97),(37,125-2),(a,125-2),(a - 15,95+2)],theme["first"])
    sleep(0.3)    
  fl(0,50,320,20,theme["background"])
  dr(txt:=f"Loaded !",(320-len(txt)*10)//2,50,theme["first"],theme["background"],False,True)
  sleep(0.5)

def game_over()->None:
  fill(theme["background"])
  if snake.stats["bestScore"]<snake.score:
    snake.stats["bestScore"] = snake.score
  dr(txt:="Game Over",(320-len(txt)*10)//2,50,theme["first"],theme["background"],False,True)
  dr(txt:=f"Score : {snake.score}",(320-len(txt)*7)//2,80,theme["first"],theme["background"],1,True)
  dr(txt:=f"High score : {snake.stats["bestScore"]}",(320-len(txt)*7)//2,90,theme["first"],theme["background"],1,True)
  dr(txt:=f"Last score : {snake.stats["lastScore"]}",(320-len(txt)*7)//2,100,theme["first"],theme["background"],1,True)
  dr(txt:=f"Golds earned : {snake.stats["golds"]}",(320-len(txt)*7-len(f"+{snake.score}")*7)//2,120,theme["first"],theme["background"],1,1)
  dr(txt:=f"+{snake.score}",(320-len(txt)*7+len(f"Golds earned : {snake.stats["golds"]}")*7)//2,120,theme["sec"],theme["background"],1,1)
  snake.stats["golds"]+=snake.score
  snake.stats["lastScore"]=snake.score
  Data.save_game(snake.stats)
  wait_ok(True)  

def store_screen()->None:
  fill("#160016")
  dr(txt:="Cyber Store",(320-len(txt)*10)//2,15,theme["first"],theme["background"],0,1)
  y = 0
  def redraw():
    dr(txt:=f"owned : {snake.stats['golds']}g.",(320-len(txt)*7)//2,30,theme["first"],theme["background"],1,1)
    for i,key in enumerate(store.keys()):
      color = "#008000" if (key=="passWall" and snake.stats["passWall"]) else "#00cc33" if y==i else "#00ff33"
      color2 = "#800000" if (key=="passWall" and snake.stats["passWall"]) else (180,30,30) if y==i else (200,50,50)
      fl(30,50+i*55,260,2,color)    
      fl(30,50+i*55,2,50,color)    
      fl(30,50+i*55+50-2,260,2,color)    
      fl(30+260-2,50+i*55,2,50,color)    
      fl(32,50+i*55+2,260-4,50-4,color2) 
      dr(f"{str(key)} : {store[key]}g.\n\t\t\t{snake.stats[key]} owned",40,50+i*55+10, color,color2,0,1)

  redraw()      
  while True:
    presses_update()
    wait_vblank()
    if k(KEY_DOWN) and y<len(list(store.keys()))-1:
      y+=1
      redraw()
    if k(KEY_UP) and y>0:
      y-=1     
      redraw()
    if click(KEY_OK):
      price = store[list(store.keys())[y]]
      if list(store.keys())[y]=="passWall" and snake.stats["passWall"]:
        pass        
      elif snake.stats["golds"]>=price:
        snake.stats["golds"]-=price
        snake.stats[list(store.keys())[y]] += 1       
      redraw()        

    if click(KEY_BACK):
      break
    sleep(0.03)
    
class Snake:  
  def __init__(self,stats)->None:
    self.stats = stats
    self.parts = [(32//2,22//2+(2-i)) for i in range(3)]
    self.oldParts = None
    self.size = 1
    self.score = 0
    self.dir = (0,-1)
    self.color = theme["snake"]

  def spawn(self,n=1)->None:
    [self.parts.insert(0,(self.parts[0][0]-self.dir[0],self.parts[0][1]-self.dir[1])) for i in range(n)]
    
  def is_dead(self)->bool:
    if self.parts[-1] in self.parts[:-1]:
      if self.stats["revivals"]:
        self.stats["revivals"]-=1
        self.oldParts = self.parts[0:self.parts[:-1].index(self.parts[-1])]
        self.parts = self.parts[self.parts[:-1].index(self.parts[-1]):]        
        return False
      return True
    if not 0<=self.parts[-1][0]<32 or not 0<=self.parts[-1][1]<22:
      if self.stats["passWall"]:
        self.parts[-1]=(self.parts[-1][0]%32,self.parts[-1][1]%22)
        return False
      return True
        
  def move(self)->None:
    if k(KEY_RIGHT) and not self.dir==(-1,0):
      self.dir = (1,0)
    elif k(KEY_LEFT) and not self.dir==(1,0):
      self.dir = (-1,0)
    elif k(KEY_DOWN) and not self.dir==(0,-1):
      self.dir = (0,1)
    elif k(KEY_UP) and not self.dir==(0,1):
      self.dir = (0,-1)
    
    fl(self.parts[0][0]*10,self.parts[0][1]*10,self.size*10,self.size*10,theme["background"])
    self.parts.reverse()
    self.parts.pop()
    self.parts.reverse()
    self.parts.append((self.parts[-1][0]+self.dir[0],self.parts[-1][1]+self.dir[1]))      
                            
  def render(self)->None:
    if self.oldParts:
      fl(self.oldParts[0][0]*10,self.oldParts[0][1]*10,self.size*10,self.size*10,theme["background"])
      self.oldParts.reverse()
      self.oldParts.pop()
      self.oldParts.reverse()
    for part in self.parts:
      fl(part[0]*10,part[1]*10,self.size*10,self.size*10,self.color)
    fl(self.parts[-1][0]*10+4,self.parts[-1][1]*10+4,2,2,"#000000")
    fill_polygon([(0,0),(30+(len(str(snake.score))-1)*7,0),(15+(len(str(snake.score))-1)*7,20),(0,20)],theme["first"])
    dr(f"{self.score}",5,5,theme["background"],theme["first"],1,1)
    fill_polygon([(0,20),(30+(len(str(snake.score))-1)*7,20),(15+(len(str(snake.stats["revivals"]))-1)*7,40),(0,40)],theme["first"])
    dr(f"{self.stats['revivals']}",5,25,theme["background"],theme["first"],1,1)
    fl(0,220,320,2,theme["background"])

  def globall(self)->None:
    self.move()
    if self.score<0:
      self.score=0
    self.render()
    
class Consommable:
  def __init__(self)->None:
    self.size = 10
    self.spawn()
    
  def spawn(self)->None:
    self.x = randint(1,30)
    self.y = randint(1,20)
  
  def _collide(self)->bool:
    return (self.x,self.y)==(snake.parts[-1][0],snake.parts[-1][1])

  def globall(self):
    self.render()

class Apple(Consommable):
  def __init__(self)->None:
    super().__init__()

  def eff(self)->None:
    fl(self.x*10,self.y*10,10,10,theme["background"])
    self.spawn()
    snake.score+=1
    snake.spawn()
            
  def render(self)->None:
    fl(self.x*10,self.y*10,self.size,self.size,theme["apple"])
    
class Cursed_apple(Consommable):
  def __init__(self)->None:
    super().__init__()
  
  def eff(self)->None:
    fl(self.x*10,self.y*10,10,10,theme["background"])
    self.spawn()
    snake.score-=1
    snake.spawn(3)
      
  def render(self)->None:
    fl(self.x*10,self.y*10,self.size,self.size,theme["cursed_apple"])
    
class Mega_apple(Consommable):
  def __init__(self)->None:
    super().__init__()
  def eff(self)->None:
    fl(self.x*10,self.y*10,10,10,theme["background"])
    snake.score+=5   
    
  def render(self)->None:
    fl(self.x*10,self.y*10,self.size,self.size,gen_color())

class Consommable_table:
  def __init__(self)->None:
    self.ent = Apple()
  def globall(self)->None:
    self.ent.globall()
    if self.ent._collide():
      self.ent.eff()
      a = randint(0,13)
      if not a//10:
        self.ent = Apple()
      elif a in (10,11):
        self.ent = Cursed_apple()
      elif a in (12,):
        self.ent = Mega_apple()

def game_screen():
  def big_redraw():
    fill(theme["background"])
    dr(txt:="Cyber Snake 2077",(320-len(txt)*10)//2,30,theme["first"],theme["background"])  
    dr(txt:="- By Mu",100,50,theme["first"],theme["background"],True,True)
  y = 0
  def redraw()->None:
    dr(txt:="  PLAY  " if y else "> PLAY <",(320-len(txt)*10)//2,90,theme["first"],theme["background"])
    dr(txt:="  STORE  " if not y==1 else "> STORE <",(320-len(txt)*10)//2,120,theme["first"],theme["background"])
    dr(txt:="  QUIT  " if not y==2 else "> QUIT <",(320-len(txt)*10)//2,150,theme["first"],theme["background"])
  big_redraw();redraw()
  while True:
    presses_update()
    if k(KEY_UP):y-=1;y%=3;redraw()
    if k(KEY_DOWN):y+=1;y%=3;redraw() 
    if click(KEY_OK):
      if not y:break
      if y==1:store_screen();big_redraw();redraw();sleep(0.1)
      if y==2:quit()
    presses_update()
    if click(KEY_BACK):quit()
    sleep(0.1)
    
def quit():
  input("unlunched")
  raise KeyboardInterrupt("You left the game")


theme = themes["chrysanthemum"]

start_game()

game = True
lunch = True

while game:
  snake = Snake(stats)
  apples = Consommable_table()
  game_screen()  
  fill(theme["background"])
  sleep(0.1)
  while lunch:
    presses_update()
    if click(KEY_BACK):
      game_over()
      break
    snake.globall()
    apples.globall()
    if snake.is_dead():
      game_over()
      break
    sleep(0.1 - snake.score/500)
