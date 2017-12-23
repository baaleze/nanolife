package fr.vahren.life;

import com.badlogic.gdx.graphics.Pixmap;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

public class LifeWorld {

    public List<Life> life = new ArrayList<>(10);

    public LifeWorld(){
    }


    public void addLife() {
        life.add(new Life(randomInt(LifeApp.WIDTH), randomInt(LifeApp.HEIGHT), this));
    }


    public static int randomInt(int max) {
        return ThreadLocalRandom.current().nextInt( max + 1);
    }

    public void addLife(int i) {
        IntStream.range(0,i).forEach(x -> addLife());
    }

    public void update() {
        life.forEach(Life::act);
    }

    public void render(Pixmap p) {
        life.forEach(l -> l.render(p));
    }

    /**
     *
     * @param x Absolute
     * @param y Absolute
     * @return
     */
    public boolean canGrowHere(int x, int y){
        for(Life l: life){
            if(l.position.x == x && l.position.y == y){
                return false;
            }
            for(Element e: l.elements){
                if(e.absx() == x && e.absy() == y){
                    return false;
                }
            }
        }
        return true;
    }
}
