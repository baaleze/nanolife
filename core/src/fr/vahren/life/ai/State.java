package fr.vahren.life.ai;

import org.deeplearning4j.rl4j.space.Encodable;

public class State implements Encodable{
    @Override
    public double[] toArray() {
        return new double[0];
    }
}
